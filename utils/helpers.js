
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

    function decodeHTMLEntities (text) {
        const textArea = document.createElement('textarea');
        let decodedText = text;

        // Decode repeatedly until the text stops changing
        do {
            textArea.innerHTML = decodedText;
            decodedText = textArea.value;
        } while (decodedText.includes('&'));

        return decodedText;
    }

    function UpdatePrompt (newPrompt) {
        StorageManager.updatePrompt(newPrompt)
            .then(() => {
                console.log('Prompt updated:', newPrompt);
                StorageManager.getPrompts()
                    .then((prompts) => {
                        UIManager.displayPrompts(prompts);
                    });
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
        promptContainer.classList.add('expanded')

        const promptTextBlock = promptContainer.querySelector('.prompt-text');
        const actionBlock = promptContainer.querySelector('.actions-block');

        promptContainer.insertBefore(actionBlock, promptContainer.firstChild);
        promptTextBlock.style.maxHeight = 'none';
        promptTextBlock.style.webkitLineClamp = 'unset';
    }

    function collapsePromptText (promptContainer) {
        promptContainer.classList.remove('expanded')

        const promptTextBlock = promptContainer.querySelector('.prompt-text');
        const actionBlock = promptContainer.querySelector('.actions-block');

        promptTextBlock.style.maxHeight = variableManager.getVariable('maxHeight');
        promptTextBlock.style.webkitLineClamp = variableManager.getVariable('lineClamp');

        const promptActionsBlock = promptContainer.querySelector('.prompt-actions-block');
        promptActionsBlock.appendChild(actionBlock);
    }

    function hideShowMoreButton (promptContainer) {
        const showMoreButton = promptContainer.querySelector('.show-more');
        showMoreButton.style.display = 'none';
    }

    function hideInactivePrompts (activePrompt) {
        const promptContainers = document.querySelectorAll('.prompt-container');
        promptContainers.forEach((prompt) => {
            if (prompt !== activePrompt) {
                prompt.style.display = 'none';
            }
        });
    }

    function showInactivePrompts () {
        const promptContainers = document.querySelectorAll('.prompt-container');
        promptContainers.forEach((prompt) => {
            prompt.style.display = 'block';
        });
    }

    return {
        adjustTextareaHeight,
        escapeHTML,
        UpdatePrompt,
        deletePrompt,
        isNotValidPrompt,
        expandPromptText,
        collapsePromptText,
        decodeHTMLEntities,
        hideShowMoreButton,
        hideInactivePrompts,
        showInactivePrompts
    };
})();