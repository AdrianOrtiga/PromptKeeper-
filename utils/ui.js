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
                    category: 'General'
                }
            }

            const promptElementContainer = createPromptElementContainer(prompt);
            promptListElement.appendChild(promptElementContainer);
        });
    }

    function createPromptElementContainer (prompt) {
        const promptContainer = createPromptContainer(prompt);
        const promptTextBlock = createPromptTextBlock(prompt);
        const actionsBlock = createActionButtons(prompt);

        createCategoryDropdown(prompt).then(categoryLabel => {
            const actionsRight = actionsBlock.querySelector('.actions-right');
            actionsRight.insertBefore(categoryLabel, actionsRight.querySelector('.modify'));
        });

        promptContainer.appendChild(actionsBlock);
        promptContainer.appendChild(promptTextBlock);

        const lineCount = prompt.text.split('\n').length;
        if (lineCount > 3 || prompt.text.length > 100) {
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
        promptTextBlock.style.overflow = 'hidden';
        promptTextBlock.style.display = '-webkit-box';
        promptTextBlock.style.webkitLineClamp = '2';
        promptTextBlock.style.lineClamp = '2';
        promptTextBlock.style.webkitBoxOrient = 'vertical';
        promptTextBlock.style.textOverflow = 'ellipsis';

        const showMoreButton = document.createElement('span');
        showMoreButton.classList.add('show-more');
        showMoreButton.textContent = 'Show more';
        showMoreButton.dataset.uniqueId = promptContainer.id;

        // When clicked, remove the truncation and show full text
        showMoreButton.addEventListener('click', ListenerFunctionsManager.togglePromptVisibility);

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

    function createActionButtons (prompt) {
        const actionsBlock = document.createElement('div');
        const actionsLeft = document.createElement('div');
        actionsLeft.classList.add('actions-left');
        const actionsRight = document.createElement('div');
        actionsRight.classList.add('actions-right');

        // Copy Button
        const copyButton = createButtonWithAction({
            buttonText: 'Copy',
            className: 'copy',
            action: ListenerFunctionsManager.copyPromtListener,
            promptText: prompt.text.replace(/\n/g, '<br>')
        });

        // Delete Button
        const deleteButton = createButtonWithAction({
            buttonText: 'Delete',
            className: 'delete',
            action: ListenerFunctionsManager.deletePromptListener,
            uniqueId: prompt.id,
            promptText: prompt.text.replace(/\n/g, '<br>')
        });

        // Modify Button
        const modifyButton = createButtonWithAction({
            buttonText: 'Modify',
            className: 'modify',
            action: ListenerFunctionsManager.modifyPromptListener,
            uniqueId: prompt.id
        });

        actionsLeft.appendChild(copyButton);
        actionsRight.appendChild(modifyButton);
        actionsRight.appendChild(deleteButton);

        actionsBlock.appendChild(actionsLeft);
        actionsBlock.appendChild(actionsRight);

        return actionsBlock;
    }

    function createCategoryDropdown (prompt) {
        const categoryLabel = document.createElement('select');
        categoryLabel.classList.add('category-label');
        categoryLabel.disabled = true; // Make the dropdown disabled

        return StorageManager.getCategories().then(categories => {
            categories.forEach(category => {
                const categoryOption = document.createElement('option');
                categoryOption.value = category;
                categoryOption.textContent = category;
                categoryLabel.appendChild(categoryOption);
            });
            categoryLabel.value = prompt.category; // Set the selected category
            return categoryLabel;
        });
    }

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

    function adjustTextareaHeight (textarea) {
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = textarea.scrollHeight + 'px'; // Set to scroll height
    }

    function appendDropdownToContainer (containerId, dropdownContainer) {
        const container = document.getElementById(containerId);
        container.appendChild(dropdownContainer);
    }

    function setupCategoryInputDropDown () {
        StorageManager.getCategories().then(categories => {
            const categoryInputContainer = createDropdownContainer(
                'classification-container',
                'Category:',
                'categoryInput',
                categories
            );

            appendDropdownToContainer('save-prompt-container', categoryInputContainer);
        });
    }

    function createTagsCategory () {
        StorageManager.getCategories().then(categories => {
            const tagsContainer = document.getElementById('tagsContainer');
            categories.forEach(category => {
                const tag = document.createElement('span');
                tag.classList.add('tag');
                tag.textContent = category;

                tag.addEventListener('click', () => {
                    tagsContainer.querySelectorAll('.tag').forEach(tag => {
                        tag.classList.remove('selected');
                    });

                    HelpersManager.filterCategories(category)
                    tag.classList.add('selected');
                });

                tagsContainer.appendChild(tag);
            });
        });
    }

    function createButtonWithAction ({ buttonText, className, action, uniqueId, index, promptText, category }) {
        const button = document.createElement('button');
        button.textContent = buttonText;
        button.classList.add(className);
        button.dataset.uniqueId = uniqueId;
        button.dataset.index = index;
        button.dataset.category = category;
        button.dataset.text = promptText;

        button.addEventListener('click', action);

        return button;
    }


    // Public API for UI Manager
    return {
        displayPrompts: displayPrompts,
        createDropdownContainer: createDropdownContainer,
        adjustTextareaHeight: adjustTextareaHeight,
        appendDropdownToContainer: appendDropdownToContainer,
        setupCategoryInputDropDown: setupCategoryInputDropDown,
        createTagsCategory: createTagsCategory,
    };
})();
