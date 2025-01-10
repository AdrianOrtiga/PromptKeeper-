
const ListenerFunctionsManager = (function () {
    const promptInput = document.getElementById('promptInput');

    function savePromptListener () {
        const prompt = {}
        const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
        prompt.id = uniqueId;
        prompt.text = HelpersManager.escapeHTML(promptInput.value);
        prompt.category = HelpersManager.getCategoryInput();
        if (prompt) {
            StorageManager.savePrompt(prompt).then(() => {
                promptInput.value = ''; // Clear input
                HelpersManager.adjustTextareaHeight(promptInput);
                HelpersManager.filterCategories(prompt.category);
            });
        }
    }

    function inputAdjustListener () {
        HelpersManager.adjustTextareaHeight(promptInput);
    }

    function copyPromtListener (event) {
        const copyButton = event.target;
        const formattedPrompt = copyButton.dataset.text;
        // Ensure you're getting only the text content without HTML tags
        navigator.clipboard.writeText(HelpersManager.escapeHTML(formattedPrompt)).then(() => {
            const message = document.createElement('span');
            message.textContent = 'Copied!';
            message.classList.add('copy-message');
            copyButton.parentElement.appendChild(message);

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
        const promptTextBlock = promptContainer.querySelector('.prompt-text');
        const categoryLabel = promptContainer.querySelector('.category-label');
        const isEditable = promptTextBlock.contentEditable === "true";
        promptTextBlock.contentEditable = !isEditable; // Toggle contentEditable
        promptTextBlock.focus(); // Focus on the text block

        if (!isEditable) {
            modifyButton.textContent = 'Save'; // Change button text to "Save"
            categoryLabel.disabled = false;

        } else {
            modifyButton.textContent = 'Modify'; // Revert button text to "Modify"
            categoryLabel.disabled = true; // Disable the dropdown

            const formattedNewPrompt = promptTextBlock.innerHTML.replace('<div>', '\n');
            const newPromptCategory = categoryLabel.value;

            newPrompt = {
                id: modifyButton.dataset.uniqueId,
                text: formattedNewPrompt,
                category: newPromptCategory
            }

            HelpersManager.UpdatePrompt(newPrompt);
        }
    }

    function togglePromptVisibility (event) {
        const showMoreButton = event.target;
        const promptContainer = document.getElementById(showMoreButton.dataset.uniqueId)
        const promptTextBlock = promptContainer.querySelector('.prompt-text');
        // when clicking on the button modify should expand the text block

        if (event.target.textContent == 'Show less') {
            promptTextBlock.style.lineClamp = '2';
            promptTextBlock.style.webkitLineClamp = '2';
            showMoreButton.textContent = 'Show more';
            return;
        }

        promptTextBlock.style.webkitLineClamp = 'unset';
        showMoreButton.textContent = 'Show less';
    }

    return {
        savePromptListener,
        inputAdjustListener,
        copyPromtListener,
        deletePromptListener,
        modifyPromptListener,
        togglePromptVisibility
    }
})();
