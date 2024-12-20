// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('savePromptButton');
    const promptInput = document.getElementById('promptInput');
    const promptList = document.getElementById('promptList');

    // Load saved prompts
    loadPrompts();

    // Save prompt on button click
    saveButton.addEventListener('click', () => {
        const prompt = promptInput.value;
        if (prompt) {
            savePrompt(prompt);
            promptInput.value = ''; // Clear input
        }
    });

    function savePrompt (prompt) {
        chrome.storage.local.get({ prompts: [] }, (result) => {
            const prompts = result.prompts;
            prompts.push(prompt);
            chrome.storage.local.set({ prompts: prompts }, () => {
                console.log('Prompt saved:', prompt);
                displayPrompts(prompts);
            });
        });
    }

    function UpdatePrompt (newPrompt, promptNumber) {
        chrome.storage.local.get({ prompts: [] }, (result) => {
            const prompts = result.prompts;

            // Replace the prompt at the specified index
            if (promptNumber >= 0 && promptNumber < prompts.length) {
                prompts[promptNumber] = newPrompt; // Update the prompt
            } else {
                console.error('Invalid prompt number:', promptNumber);
                return;
            }

            chrome.storage.local.set({ prompts: prompts }, () => {
                console.log('Prompt updated:', newPrompt);
                displayPrompts(prompts);
            });
        });
    }

    function deletePrompt (promptNumber) {
        chrome.storage.local.get({ prompts: [] }, (result) => {
            const prompts = result.prompts;
            prompts.splice(promptNumber, 1);
            chrome.storage.local.set({ prompts: prompts }, () => {
                console.log('Prompt deleted:', index);
                displayPrompts(prompts);
            });
        });
    }

    function loadPrompts () {
        chrome.storage.local.get({ prompts: [] }, (result) => {
            displayPrompts(result.prompts);
        });
    }

    function displayPrompts (prompts) {
        promptList.innerHTML = '';

        prompts.forEach((prompt, index) => {

            const promptContainer = document.createElement('div');

            const promptTextBlock = document.createElement('div');
            // Replace newlines with <br> tags for proper rendering
            const formattedPrompt = prompt.replace(/\n/g, '<br>');
            promptTextBlock.innerHTML = `${formattedPrompt}`;

            const actionsBlock = document.createElement('div');

            // const promptIndex = document.createElement('span')
            // promptIndex.classList.add('prompt-number')
            // promptIndex.textContent = `${index + 1}.`

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete')

            deleteButton.addEventListener('click', () => {
                prompts.splice(index, 1); // Remove the prompt in the list
                deletePrompt(index); // Remove the stored prompt
                displayPrompts(prompts); // Re-render the list
            });

            const modifyButton = document.createElement('button');
            modifyButton.textContent = 'Modify';
            modifyButton.classList.add('modify')
            promptTextBlock.contentEditable = false

            modifyButton.addEventListener('click', () => {
                const isEditable = promptTextBlock.contentEditable === "true";
                promptTextBlock.contentEditable = !isEditable; // Toggle contentEditable
                promptTextBlock.focus(); // Focus on the text block
                if (!isEditable) {
                    modifyButton.textContent = 'Save'; // Change button text to "Save"
                } else {
                    modifyButton.textContent = 'Modify'; // Revert button text to "Modify"
                    newPrompt = promptTextBlock.innerHTML
                    const formattedNewPrompt = newPrompt.replace('<div>', '\n');
                    console.log(formattedNewPrompt)
                    UpdatePrompt(formattedNewPrompt, index)
                }
            });

            // actionsBlock.appendChild(promptIndex);
            actionsBlock.appendChild(modifyButton);
            actionsBlock.appendChild(deleteButton);

            promptContainer.appendChild(actionsBlock);
            promptContainer.appendChild(promptTextBlock);

            promptList.appendChild(promptContainer);
        });
    }
});
