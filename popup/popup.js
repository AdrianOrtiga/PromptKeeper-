// popup.js
document.addEventListener('DOMContentLoaded', () => {

    UIManager.setupCategoryInputDropDown();
    UIManager.setupFilterDropDown();
    StorageManager.getPrompts()
        .then((prompts) => {
            UIManager.displayPrompts(prompts);
        });

    const saveButton = document.getElementById('savePromptButton');
    saveButton.addEventListener('click', ListenerFunctionsManager.savePromptListener);

    // Add an input event listener to adjust the height on input
    promptInput.addEventListener('input', ListenerFunctionsManager.inputAdjustListener);

    // Initial adjustment to set the correct height
    HelpersManager.adjustTextareaHeight(promptInput);
});
