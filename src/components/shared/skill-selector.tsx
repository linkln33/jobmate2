import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Chip, 
  Autocomplete, 
  Paper,
  Divider,
  styled,
  Collapse,
  IconButton,
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getSkillsByCategory, SkillSuggestion } from '../../data/suggested-skills';

interface SkillSelectorProps {
  intentId: string;
  categoryId: string;
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
}));

const CategoryHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  padding: theme.spacing(1, 0),
}));

const SkillSelector: React.FC<SkillSelectorProps> = ({
  intentId,
  categoryId,
  selectedSkills,
  onChange,
  label = 'Skills',
  placeholder = 'Add a skill',
  helperText = 'Select skills or add your own'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, SkillSuggestion[]>>({});
  
  // Load suggested skills based on intent and category
  useEffect(() => {
    if (intentId && categoryId) {
      const categorizedSkills = getSkillsByCategory(intentId, categoryId);
      setSkillsByCategory(categorizedSkills);
      
      // Initialize all categories as expanded
      const initialExpandedState: Record<string, boolean> = {};
      Object.keys(categorizedSkills).forEach(category => {
        initialExpandedState[category] = true;
      });
      setExpandedCategories(initialExpandedState);
    }
  }, [intentId, categoryId]);

  // Handle adding a custom skill
  const handleAddSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      onChange([...selectedSkills, skill]);
      setInputValue('');
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (skill: string) => {
    onChange(selectedSkills.filter(s => s !== skill));
  };

  // Handle toggling category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };

  // Handle selecting a suggested skill
  const handleSelectSuggestedSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      onChange([...selectedSkills, skill]);
    }
  };

  // Get all available skills for autocomplete
  const getAllSkills = (): string[] => {
    const allSkills: string[] = [];
    Object.values(skillsByCategory).forEach(categorySkills => {
      categorySkills.forEach(skill => {
        if (!allSkills.includes(skill.name)) {
          allSkills.push(skill.name);
        }
      });
    });
    return allSkills;
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      
      {/* Selected skills */}
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {selectedSkills.length > 0 ? (
          selectedSkills.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              onDelete={() => handleRemoveSkill(skill)}
              color="primary"
              variant="outlined"
              size="medium"
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No skills selected yet
          </Typography>
        )}
      </Box>
      
      {/* Skill input */}
      <Autocomplete
        freeSolo
        options={getAllSkills().filter(skill => !selectedSkills.includes(skill))}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
        onChange={(_event, newValue) => {
          if (typeof newValue === 'string') {
            handleAddSkill(newValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={placeholder}
            variant="outlined"
            fullWidth
            helperText={helperText}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue) {
                e.preventDefault();
                handleAddSkill(inputValue);
              }
            }}
          />
        )}
        sx={{ mb: 3 }}
      />
      
      {/* Suggested skills by category */}
      <Typography variant="subtitle2" gutterBottom>
        Suggested Skills
      </Typography>
      
      {Object.keys(skillsByCategory).length > 0 ? (
        Object.entries(skillsByCategory).map(([category, skills]) => (
          <StyledPaper key={category} elevation={0}>
            <CategoryHeader onClick={() => toggleCategory(category)}>
              <Typography variant="subtitle2" color="primary">
                {category}
              </Typography>
              <IconButton size="small">
                {expandedCategories[category] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </CategoryHeader>
            
            <Collapse in={expandedCategories[category]}>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {skills.map((skill) => (
                  <Grid item key={skill.name}>
                    <Chip
                      label={skill.name}
                      onClick={() => handleSelectSuggestedSkill(skill.name)}
                      color={selectedSkills.includes(skill.name) ? "primary" : "default"}
                      variant={selectedSkills.includes(skill.name) ? "filled" : "outlined"}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Collapse>
          </StyledPaper>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No suggested skills available for this category
        </Typography>
      )}
    </Box>
  );
};

export default SkillSelector;
