
const HelpersManager = (function () {
    function adjustTextareaHeight (textarea) {
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = textarea.scrollHeight + 'px'; // Set to scroll height
    }

    function escapeHTML (str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function UpdatePrompt (newPrompt) {
        StorageManager.updatePrompt(newPrompt)
            .then(() => {
                console.log('Prompt updated:', newPrompt);
            })
            .catch((error) => {
                console.error('Failed to update prompt:', error);
            });
    }

    function deletePrompt (promptNumber) {
        StorageManager.deletePrompt(promptNumber)
            .then(() => {
                console.log('Prompt deleted:', promptNumber);
            })
            .catch((error) => {
                console.error('Failed to delete prompt:', error);
            });
    }

    function isNotValidPrompt (prompt) {
        if (typeof prompt !== 'object') return true;
        if (!prompt.hasOwnProperty('id')) return true;
        if (!prompt.hasOwnProperty('text')) return true;
        return false;
    }

    function expandPromptText (promptContainer) {
        const promptTextBlock = promptContainer.querySelector('.prompt-text');
        const actionBlock = promptContainer.querySelector('.actions-block');

        promptContainer.insertBefore(actionBlock, promptContainer.firstChild);
        promptTextBlock.style.maxHeight = 'none';
        promptTextBlock.style.webkitLineClamp = 'unset';
    }

    function collapsePromptText (promptContainer) {
        const promptTextBlock = promptContainer.querySelector('.prompt-text');
        const actionBlock = promptContainer.querySelector('.actions-block');

        promptTextBlock.style.maxHeight = variableManager.getVariable('maxHeight');
        promptTextBlock.style.webkitLineClamp = variableManager.getVariable('lineClamp');

        const promptActionsBlock = promptContainer.querySelector('.prompt-actions-block');
        promptActionsBlock.appendChild(actionBlock);
    }

    return {
        adjustTextareaHeight,
        escapeHTML,
        UpdatePrompt,
        deletePrompt,
        isNotValidPrompt,
        expandPromptText,
        collapsePromptText
    };
})();