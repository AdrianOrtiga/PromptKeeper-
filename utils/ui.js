// ui.js
const UIManager = (function () {
    const promptListElement = document.getElementById('promptList');

    // Private function for displaying prompts
    function displayPrompts (prompts) {
        promptListElement.innerHTML = '';
        prompts.forEach((prompt) => {
            if (HelpersManager.isNotValidPrompt(prompt)) {
                prompt = {
                    id: Date.now() + '-' + Math.random().toString(36).substring(2, 15),
                    text: prompt.text,
                }
            }

            const promptElementContainer = createPromptElementContainer(prompt);
            promptListElement.appendChild(promptElementContainer);
        });
    }

    function createPromptElementContainer (prompt) {
        const promptContainer = createPromptContainer(prompt);
        const promptActionsBlock = createPromptActionsBlock();
        const actionBlock = createActionButtons(prompt);
        const promptTextBlock = createPromptTextBlock(prompt);

        promptActionsBlock.appendChild(promptTextBlock);
        promptActionsBlock.appendChild(actionBlock);
        promptContainer.appendChild(promptActionsBlock);

        const lineCount = prompt.text.split('\n').length;
        if (lineCount > 1 || prompt.text.length > 50) {
            createShowMoreButton(promptContainer);
        }

        return promptContainer;
    }

    function createPromptContainer (prompt) {
        const promptContainer = document.createElement('div');
        promptContainer.classList.add('prompt-container');
        promptContainer.id = prompt.id;
        return promptContainer;
    }

    function createShowMoreButton (promptContainer) {
        const promptTextBlock = promptContainer.querySelector('.prompt-text');
        promptTextBlock.style.display = '-webkit-box';
        promptTextBlock.style.webkitLineClamp = variableManager.getVariable('lineClamp');
        promptTextBlock.style.maxHeight = variableManager.getVariable('maxHeight');
        promptTextBlock.style.webkitBoxOrient = 'vertical';
        promptTextBlock.style.overflow = 'hidden';
        promptTextBlock.style.textOverflow = 'ellipsis';
        promptTextBlock.style.wordWrap = 'break-word';

        const showMoreButton = document.createElement('span');
        showMoreButton.classList.add('show-more');
        showMoreButton.textContent = 'Show more';
        showMoreButton.dataset.uniqueId = promptContainer.id;

        // When clicked, remove the truncation and show full text
        showMoreButton.addEventListener('click', ListenerFunctionsManager.togglePromptExpansion);

        promptContainer.appendChild(showMoreButton);
    }


    function createPromptTextBlock (prompt) {
        const promptTextBlock = document.createElement('div');
        promptTextBlock.classList.add('prompt-text');
        // Replace newlines with <br> tags for proper rendering
        const formattedPrompt = prompt.text.replace(/\n/g, '<br>');
        promptTextBlock.innerHTML = formattedPrompt;
        return promptTextBlock;
    }

    function createPromptActionsBlock () {
        const prompActionsBlock = document.createElement('div');
        prompActionsBlock.classList.add('prompt-actions-block');
        return prompActionsBlock;
    }


    function createActionButtons (prompt) {
        const actionsBlock = document.createElement('div');
        actionsBlock.classList.add('actions-block');

        // Copy Button
        const copyButton = createButtonWithAction({
            buttonText: 'Copy',
            className: 'copy',
            action: ListenerFunctionsManager.copyPromtListener,
            promptText: prompt.text
        });

        // Delete Button
        const deleteButton = createButtonWithAction({
            buttonText: 'Delete',
            className: 'delete',
            action: ListenerFunctionsManager.deletePromptListener,
            uniqueId: prompt.id,
            promptText: prompt.text
        });

        // Modify Button
        const modifyButton = createButtonWithAction({
            buttonText: 'Modify',
            className: 'modify',
            action: ListenerFunctionsManager.modifyPromptListener,
            uniqueId: prompt.id
        });

        actionsBlock.appendChild(copyButton);
        actionsBlock.appendChild(modifyButton);
        actionsBlock.appendChild(deleteButton);

        return actionsBlock;
    }

    function adjustTextareaHeight (textarea) {
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = textarea.scrollHeight + 'px'; // Set to scroll height
    }

    function createButtonWithAction ({ buttonText, className, action, uniqueId, index, promptText }) {
        const button = document.createElement('button');
        button.textContent = buttonText;
        button.classList.add(className);
        button.dataset.uniqueId = uniqueId;
        button.dataset.index = index;
        button.dataset.text = promptText;

        button.addEventListener('click', action);

        return button;
    }


    // Public API for UI Manager
    return {
        displayPrompts: displayPrompts,
        createPromptElementContainer: createPromptElementContainer,
        adjustTextareaHeight: adjustTextareaHeight
    };
})();
