/**
 * Utility functions for auto-inserting content into form fields
 */

/**
 * Insert content into a form field by ID
 * @param fieldId - The HTML ID of the target form field
 * @param content - The content to insert
 * @returns boolean indicating success
 */
export const insertIntoField = (fieldId: string, content: string): boolean => {
  try {
    // Find the field in the DOM
    const element = document.getElementById(fieldId);
    
    if (!element) {
      console.error(`Field with ID ${fieldId} not found`);
      return false;
    }
    
    // Type guard to ensure element is an input or textarea
    const field = element as HTMLInputElement | HTMLTextAreaElement;
    
    // Verify the element is actually a form input element
    if (!(element instanceof HTMLInputElement) && !(element instanceof HTMLTextAreaElement)) {
      console.error(`Element with ID ${fieldId} is not a form input element`);
      return false;
    }
    
    // Insert content based on field type
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      // Save current selection/cursor position
      const startPos = field.selectionStart || 0;
      const endPos = field.selectionEnd || 0;
      
      // Update value
      const currentValue = field.value;
      field.value = currentValue.substring(0, startPos) + content + currentValue.substring(endPos);
      
      // Set cursor position after inserted content
      field.selectionStart = startPos + content.length;
      field.selectionEnd = startPos + content.length;
      
      // Trigger change event for React forms
      const event = new Event('input', { bubbles: true });
      field.dispatchEvent(event);
      
      // Focus the field
      field.focus();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error inserting content into field:', error);
    return false;
  }
};

/**
 * Insert content into the currently focused form field
 * @param content - The content to insert
 * @returns boolean indicating success
 */
export const insertIntoActiveField = (content: string): boolean => {
  try {
    // Get the currently focused element
    const element = document.activeElement;
    
    if (!element) {
      console.error('No active element found');
      return false;
    }
    
    // Type guard for the active element
    const activeElement = element as HTMLElement;
    
    // Check if it's an input or textarea
    if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
      // Save current selection/cursor position
      const startPos = activeElement.selectionStart || 0;
      const endPos = activeElement.selectionEnd || 0;
      
      // Update value
      const currentValue = activeElement.value;
      activeElement.value = currentValue.substring(0, startPos) + content + currentValue.substring(endPos);
      
      // Set cursor position after inserted content
      activeElement.selectionStart = startPos + content.length;
      activeElement.selectionEnd = startPos + content.length;
      
      // Trigger change event for React forms
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
      
      return true;
    }
    
    // Handle contentEditable elements (like rich text editors)
    if ('isContentEditable' in activeElement && activeElement.isContentEditable) {
      // Get selection
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Delete selected content
        range.deleteContents();
        
        // Insert new content
        const textNode = document.createTextNode(content);
        range.insertNode(textNode);
        
        // Move cursor to end of inserted content
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Trigger input event
        const event = new Event('input', { bubbles: true });
        if ('dispatchEvent' in activeElement) {
          activeElement.dispatchEvent(event);
        }
        
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error inserting content into active field:', error);
    return false;
  }
};

/**
 * Fill a form with multiple field values
 * @param fieldValues - Object mapping field IDs to content
 * @returns Object with results for each field
 */
export const fillFormFields = (fieldValues: Record<string, string>): Record<string, boolean> => {
  const results: Record<string, boolean> = {};
  
  for (const [fieldId, content] of Object.entries(fieldValues)) {
    results[fieldId] = insertIntoField(fieldId, content);
  }
  
  return results;
};

/**
 * Find form fields on the current page
 * @returns Array of field IDs and their types
 */
export const findFormFields = (): Array<{id: string, type: string, name: string}> => {
  const fields: Array<{id: string, type: string, name: string}> = [];
  
  // Find all input and textarea elements
  const inputElements = document.querySelectorAll('input, textarea');
  
  inputElements.forEach((element) => {
    const el = element as HTMLInputElement | HTMLTextAreaElement;
    if (el.id) {
      fields.push({
        id: el.id,
        type: el.tagName.toLowerCase() === 'textarea' ? 'textarea' : (el as HTMLInputElement).type,
        name: el.name || ''
      });
    }
  });
  
  return fields;
};
