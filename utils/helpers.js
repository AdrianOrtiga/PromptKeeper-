
const HelpersManager = (function () {
    function filterCategories (category) {
        StorageManager.getPrompts().then(prompts => {
            const filteredPrompts = category === 'All'
                ? prompts
                : prompts.filter(prompt => prompt.category === category);

            UIManager.displayPrompts(filteredPrompts);

            // Update the filter dropdown to reflect the selected category
            const filterCategory = document.getElementById('filterCategory');
            filterCategory.value = category;
        });
    }

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
                filterCategories(getCategoryFilter());
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
        if (!prompt.hasOwnProperty('category')) return true;
        return false;
    }

    function getCategoryInput () {
        const categoryInput = document.getElementById('categoryInput');
        return categoryInput.value;
    }

    function getCategoryFilter () {
        const filterCategory = document.getElementById('filterCategory');
        return filterCategory.value;
    }

    return {
        filterCategories,
        adjustTextareaHeight,
        escapeHTML,
        UpdatePrompt,
        deletePrompt,
        isNotValidPrompt,
        getCategoryInput,
        getCategoryFilter
    };
})();