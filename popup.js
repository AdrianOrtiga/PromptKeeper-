// popup.js

document.addEventListener('DOMContentLoaded', () => {

    loadCategories();
    loadSavedPrompts();

    const saveButton = document.getElementById('savePromptButton');
    const promptInput = document.getElementById('promptInput');
    const promptList = document.getElementById('promptList');

    // Save prompt on button click
    saveButton.addEventListener('click', () => {
        const prompt = escapeHTML(promptInput.value);
        const categoryList = document.getElementById('categoryInput')
        const category = categoryList.value;
        if (prompt) {
            savePrompt(prompt, category);
            promptInput.value = ''; // Clear input
            adjustTextareaHeight(promptInput);
        }
    });

    function savePrompt (prompt, category) {
        chrome.storage.local.get({ prompts: [] }, (result) => {
            const prompts = result.prompts;
            prompts.push({ text: prompt, category: category });
            chrome.storage.local.set({ prompts: prompts }, () => {
                console.log('Prompt saved:', prompt);
                displayPrompts(prompts);
            });
        });
    }

    function UpdatePrompt (newPrompt, promptNumber, newPromptCategory) {
        chrome.storage.local.get({ prompts: [] }, (result) => {
            const prompts = result.prompts;

            // Replace the prompt at the specified index
            if (promptNumber >= 0 && promptNumber < prompts.length) {
                console.log(prompts[promptNumber])
                prompts[promptNumber] = { text: newPrompt, category: newPromptCategory };

                console.log(prompts[promptNumber])
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

    function loadSavedPrompts () {
        chrome.storage.local.get({ prompts: [] }, (result) => {
            displayPrompts(result.prompts);
        });
    }

    function displayPrompts (prompts) {
        promptList.innerHTML = '';
        prompts.forEach((prompt, index) => {
            let promptText = ''

            promptIsObjectAndHasCategory = (typeof prompt === 'object' && prompt.category && prompt.text)
            if (promptIsObjectAndHasCategory) {
                promptText = prompt.text
            } else {
                promptText = prompt
            }

            const promptContainer = document.createElement('div');

            const promptTextBlock = document.createElement('div');
            // Replace newlines with <br> tags for proper rendering
            const formattedPrompt = promptText.replace(/\n/g, '<br>');
            promptTextBlock.innerHTML = `${formattedPrompt}`;

            const actionsBlock = document.createElement('div');
            const actionsLeft = document.createElement('div');
            actionsLeft.classList.add('actions-left');
            const actionsRight = document.createElement('div');
            actionsRight.classList.add('actions-right');

            // const promptIndex = document.createElement('span')
            // promptIndex.classList.add('prompt-number')
            // promptIndex.textContent = `${index + 1}.`

            // Copy Button
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.classList.add('copy');
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(promptText).then(() => {
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
            });

            // delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete')

            deleteButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to deleted the prompt? /n You want be able to recover it.')) {

                    prompts.splice(index, 1); // Remove the prompt in the list
                    deletePrompt(index); // Remove the stored prompt
                    displayPrompts(prompts); // Re-render the list
                }
            });

            // Create and append the category label
            const categoryLabel = document.createElement('select');
            categoryLabel.classList.add('category-label');
            categoryLabel.disabled = true; // Make the dropdown disabled

            // Create an option for the dropdown
            const categoryOption = document.createElement('option');
            categoryOption.textContent = promptIsObjectAndHasCategory ? prompt.category : 'General';

            categoryLabel.appendChild(categoryOption);

            // modify button
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
                    categoryLabel.disabled = false;

                } else {
                    modifyButton.textContent = 'Modify'; // Revert button text to "Modify"
                    categoryLabel.disabled = true; // Disable the dropdown

                    newPrompt = promptTextBlock.innerHTML
                    const formattedNewPrompt = newPrompt.replace('<div>', '\n');
                    const newPromptCategory = categoryLabel.value;

                    UpdatePrompt(formattedNewPrompt, index, newPromptCategory)
                }
            });

            actionsLeft.appendChild(copyButton);

            actionsRight.appendChild(categoryLabel)
            actionsRight.appendChild(modifyButton);
            actionsRight.appendChild(deleteButton);

            actionsBlock.appendChild(actionsLeft);
            actionsBlock.appendChild(actionsRight);

            promptContainer.appendChild(actionsBlock);
            promptContainer.appendChild(promptTextBlock);

            promptList.appendChild(promptContainer);
        });
    }

    // Function to adjust the height of the textarea
    function adjustTextareaHeight (textarea) {
        textarea.style.height = 'auto'; // Reset the height
        textarea.style.height = textarea.scrollHeight + 'px'; // Set the height to the scroll height
    }

    // Add an input event listener to adjust the height on input
    promptInput.addEventListener('input', () => {
        adjustTextareaHeight(promptInput);
    });

    // Initial adjustment to set the correct height
    adjustTextareaHeight(promptInput);

    function createDropdownContainer (containerClass, labelText, dropdownId, categories, includeAllOption = false) {
        // Create the container div
        const container = document.createElement('div');
        container.classList.add(containerClass);

        // Create the label
        const label = document.createElement('label');
        label.setAttribute('for', dropdownId);
        label.textContent = labelText;

        // Create the dropdown
        const dropdown = document.createElement('select');
        dropdown.id = dropdownId;

        // Optionally add the "All" option
        if (includeAllOption) {
            const allOption = document.createElement('option');
            allOption.value = 'All';
            allOption.textContent = 'All';
            dropdown.appendChild(allOption);
        }

        // Populate the dropdown with categories
        categories.forEach(category => {
            const categoryOption = document.createElement('option');
            categoryOption.value = category;
            categoryOption.textContent = category;
            dropdown.appendChild(categoryOption);
        });

        // Append the label and dropdown to the container
        container.appendChild(label);
        container.appendChild(dropdown);

        return container;
    }

    function loadCategories () {
        // Retrieve the list of categories from storage
        chrome.storage.local.get({ categories: ['General', 'Marketing', 'Technical', 'Personal'] }, (result) => {
            const categories = result.categories;

            // Create the category input container
            const categoryInputContainer = createDropdownContainer(
                'classification-container',
                'Category:',
                'categoryInput',
                categories
            );

            // Append the category input container to the desired location in the HTML
            const savePromptContainer = document.getElementById('save-prompt-container'); // Ensure you have an element with this ID in your HTML
            savePromptContainer.appendChild(categoryInputContainer);

            // Create the filter dropdown container
            const filterDropdownContainer = createDropdownContainer(
                'filter-container',
                'Filter by Category:',
                'filterCategory',
                categories,
                true
            );

            const filterCategory = filterDropdownContainer.querySelector('#filterCategory')

            filterCategory.addEventListener('change', () => {
                const selectedCategory = filterCategory.value;
                chrome.storage.local.get({ prompts: [] }, (result) => {
                    const filteredPrompts = selectedCategory === 'All'
                        ? result.prompts
                        : result.prompts.filter(prompt => prompt.category === selectedCategory);
                    displayPrompts(filteredPrompts);
                });
            });

            // Append the filter dropdown container to the desired location in the HTML
            const filterContainer = document.getElementById('promptManagementContainer');
            filterContainer.appendChild(filterDropdownContainer);

        });
    }

    function escapeHTML (str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }
});
