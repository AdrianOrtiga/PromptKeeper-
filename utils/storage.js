// storage.js
const StorageManager = (function () {
    // Private variables and functions
    function getFromStorage (key, defaultValue) {
        return new Promise((resolve) => {
            chrome.storage.local.get({ [key]: defaultValue }, (result) => {
                resolve(result[key]);
            });
        });
    }

    function setToStorage (key, value) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ [key]: value }, () => {
                resolve();
            });
        });
    }

    function getPrompts () {
        return getFromStorage('prompts', []);
    }

    function savePrompt (prompt) {
        return this.getPrompts().then((prompts) => {
            prompts.unshift(prompt);
            return setToStorage('prompts', prompts);
        });
    }

    function updatePrompt (newPrompt) {
        return this.getPrompts().then((prompts) => {

            const promptIndex = prompts.findIndex(prompt => prompt.id === newPrompt.id);
            prompts[promptIndex] = newPrompt;
            return setToStorage('prompts', prompts);

        }).catch((error) => {
            console.error('Failed to update prompt:', error);
        });
    }

    function deletePrompt (uniqueId) {
        return this.getPrompts().then((prompts) => {
            const promptIndex = prompts.findIndex(prompt => prompt.id === uniqueId);
            prompts.splice(promptIndex, 1);
            return setToStorage('prompts', prompts);
        });
    }

    // Public API exposed outside the IIFE
    return {
        getPrompts: getPrompts,
        savePrompt: savePrompt,
        updatePrompt: updatePrompt,
        deletePrompt: deletePrompt
    }
})();   
