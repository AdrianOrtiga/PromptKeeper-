
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



    return {
        adjustTextareaHeight,
        escapeHTML,
        UpdatePrompt,
        deletePrompt,
        isNotValidPrompt,
    };
})();