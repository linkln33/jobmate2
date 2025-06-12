import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Form validation schemas
const profileSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name is required'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(8, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const Settings: React.FC = () => {
  const { supabase, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile form setup
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isDirty: profileIsDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  // Password form setup
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // Try to fetch from profiles table
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Even if there's an error (like table doesn't exist), we'll still show the email
        resetProfile({
          email: user.email || '',
          name: data?.name || user.user_metadata?.name || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Still set the email from the user object
        resetProfile({
          email: user.email || '',
          name: user.user_metadata?.name || '',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [supabase, user, resetProfile]);

  // Handle profile update
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setProfileMessage(null);
    
    try {
      // Update email in auth
      if (user?.email !== data.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email,
        });

        if (emailError) throw emailError;
      }
      
      // Update name in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name: data.name })
        .eq('id', user?.id);

      if (profileError) throw profileError;
      
      setProfileMessage({
        type: 'success',
        text: 'Profile updated successfully! Check your email for verification if you changed your email address.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setProfileMessage({
        type: 'error',
        text: error.message || 'Failed to update profile. Please try again.',
      });
    }
  };

  // Handle password update
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setPasswordMessage(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;
      
      resetPassword();
      
      setPasswordMessage({
        type: 'success',
        text: 'Password updated successfully!',
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      setPasswordMessage({
        type: 'error',
        text: error.message || 'Failed to update password. Please try again.',
      });
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
          <p className="mt-1 text-sm text-gray-500">
            Update your account information
          </p>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-4">Loading profile information...</div>
          ) : (
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="admin@example.com"
                    {...registerProfile('email')}
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="John Doe"
                    {...registerProfile('name')}
                  />
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                  )}
                </div>
              </div>

              {/* Status Message */}
              {profileMessage && (
                <div
                  className={`p-4 rounded-md ${
                    profileMessage.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {profileMessage.text}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!profileIsDirty}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                    !profileIsDirty ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
          <p className="mt-1 text-sm text-gray-500">
            Update your account password
          </p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  {...registerPassword('currentPassword')}
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  {...registerPassword('newPassword')}
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  {...registerPassword('confirmPassword')}
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Status Message */}
            {passwordMessage && (
              <div
                className={`p-4 rounded-md ${
                  passwordMessage.type === 'success'
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {/* Logout */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-gray-900">Log Out</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Sign out of your account
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Log Out
              </button>
            </div>
            
            <hr className="my-6" />
            
            {/* Danger Zone */}
            <div>
              <h4 className="text-base font-medium text-red-600">Danger Zone</h4>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium text-gray-900">Delete Account</h5>
                  <p className="mt-1 text-sm text-gray-500">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      alert('In a production environment, this would delete your account.');
                    }
                  }}
                  className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
