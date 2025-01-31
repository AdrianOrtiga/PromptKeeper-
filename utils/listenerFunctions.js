
const ListenerFunctionsManager = (function () {
    const promptInput = document.getElementById('promptInput');

    function savePromptListener () {
        const prompt = {}
        const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
        prompt.id = uniqueId;
        prompt.text = HelpersManager.escapeHTML(promptInput.value);
        if (prompt) {
            StorageManager.savePrompt(prompt).then(() => {
                promptInput.value = ''; // Clear input
                HelpersManager.adjustTextareaHeight(promptInput);
            });

            const newPromptContainer = UIManager.createPromptElementContainer(prompt);
            const promptListElement = document.getElementById('promptList');
            promptListElement.insertBefore(newPromptContainer, promptListElement.firstChild);
        }
    }

    function inputAdjustListener () {
        HelpersManager.adjustTextareaHeight(promptInput);
    }

    function copyPromtListener (event) {
        const copyButton = event.target;
        let formattedPrompt = copyButton.dataset.text;
        formattedPrompt = HelpersManager.decodeHTMLEntities(formattedPrompt);
        formattedPrompt = formattedPrompt.replace(/<br>/g, '\n');
        formattedPrompt = formattedPrompt.replace(/<div>/g, '');
        formattedPrompt = formattedPrompt.replace(/<\/div>/g, '\n');

        // Ensure you're getting only the text content without HTML tags
        navigator.clipboard.writeText(formattedPrompt).then(() => {
            document.querySelectorAll('.copy-message').forEach(message => message.remove());
            const message = document.createElement('span');
            message.textContent = 'Copied!';
            message.classList.add('copy-message');
            copyButton.parentElement.insertBefore(message, copyButton);

            setTimeout(() => {
                message.remove();
            }, 2000); // Remove after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    function deletePromptListener (event) {
        const deleteButton = event.target;
        const uniqueId = deleteButton.dataset.uniqueId;
        if (confirm('Are you sure you want to delete the prompt? \n You won\'t be able to recover it.')) {
            StorageManager.deletePrompt(uniqueId).then(() => {
                console.log('Prompt deleted:', uniqueId);
                document.getElementById(uniqueId).remove();
            }).catch((error) => {
                console.error('Failed to delete prompt:', error);
            });
        }
    }

    function modifyPromptListener (event) {
        const modifyButton = event.target;
        const promptContainer = document.getElementById(modifyButton.dataset.uniqueId);
        const promptIsCollapsed = !promptContainer.classList.contains('expanded')
        const showMoreButton = promptContainer.querySelector('.show-more')
        const promptTextBlock = promptContainer.querySelector('.prompt-text');
        const isEditable = promptTextBlock.contentEditable === "true";
        promptTextBlock.contentEditable = !isEditable; // Toggle contentEditable
        promptTextBlock.focus(); // Focus on the text block

        if (!isEditable) {
            if (promptIsCollapsed) showMoreButton.click()
            showMoreButton.style.display = 'none'
            modifyButton.textContent = 'Save'; // Change button text to "Save"
            HelpersManager.hideInactivePrompts(promptContainer);
        } else {
            if (!promptIsCollapsed) showMoreButton.click()
            showMoreButton.style.display = 'block'
            modifyButton.textContent = 'Modify'; // Revert button text to "Modify"
            const formattedNewPrompt = promptTextBlock.innerHTML.replace('<div>', '\n');
            HelpersManager.showInactivePrompts();
            newPrompt = {
                id: modifyButton.dataset.uniqueId,
                text: formattedNewPrompt,
            }

            HelpersManager.UpdatePrompt(newPrompt);
        }
    }

    function togglePromptExpansion (event) {
        const showMoreButton = event.target;
        const promptContainer = document.getElementById(showMoreButton.dataset.uniqueId);
        console.log(showMoreButton.textContent) // debug delte later
        if (showMoreButton.textContent == 'Show less') {
            HelpersManager.collapsePromptText(promptContainer)
            showMoreButton.textContent = 'Show more';
            return;
        }

        HelpersManager.expandPromptText(promptContainer)
        showMoreButton.textContent = 'Show less';
    }

    return {
        savePromptListener,
        inputAdjustListener,
        copyPromtListener,
        deletePromptListener,
        modifyPromptListener,
        togglePromptExpansion
    }
})();
