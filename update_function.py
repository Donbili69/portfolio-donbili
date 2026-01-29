#!/usr/bin/env python3

# Read the script file
with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the initCodeSnippets function
old_function_start = "function initCodeSnippets() {"
new_function = '''function initCodeSnippets() {
    const codeModal = document.getElementById('code-modal');
    const codeTitle = document.getElementById('code-title');
    const codeOutput = document.getElementById('code-output');
    const codeSnippetBlock = document.getElementById('code-snippet').querySelector('code');
    const codeCopyBtn = document.getElementById('copy-code-btn');
    const codeRunBtn = document.getElementById('run-code-btn');
    const codeModalClose = document.getElementById('code-modal-close');
    const learnMoreBtn = document.getElementById('learn-more-btn');

    if (!codeModal) return;

    // Close Modal
    const closeCodeModal = () => codeModal.style.display = 'none';
    if (codeModalClose) codeModalClose.addEventListener('click', closeCodeModal);
    
    codeModal.addEventListener('click', (e) => {
        if (e.target === codeModal) closeCodeModal();
    });

    // Copy Code
    if (codeCopyBtn) {
        codeCopyBtn.addEventListener('click', () => {
            const code = codeSnippetBlock.textContent;
            navigator.clipboard.writeText(code).then(() => {
                const original = codeCopyBtn.textContent;
                codeCopyBtn.textContent = '✓ Copied!';
                setTimeout(() => codeCopyBtn.textContent = original, 2000);
            });
        });
    }

    // Run Code
    if (codeRunBtn) {
        codeRunBtn.addEventListener('click', () => {
            const skill = codeRunBtn.getAttribute('data-skill');
            const snippet = CODE_SNIPPETS[skill];
            if (snippet && snippet.output) {
                codeOutput.innerHTML = snippet.output;
                codeOutput.style.display = 'block';
                const original = codeRunBtn.textContent;
                codeRunBtn.textContent = '▶ Output Rendered!';
                setTimeout(() => codeRunBtn.textContent = original, 2000);
            }
        });
    }

    // Show Code Snippet
    document.querySelectorAll('.code-curiosity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const skill = btn.getAttribute('data-skill');
            const snippet = CODE_SNIPPETS[skill];
            if (snippet) {
                const skillNames = {
                    htmlcss: 'HTML & CSS',
                    javascript: 'JavaScript',
                    react: 'React',
                    responsive: 'Responsive Design',
                    nodejs: 'Node.js',
                    python: 'Python',
                    database: 'Databases',
                    api: 'REST APIs',
                    git: 'Git',
                    agile: 'Agile',
                    docker: 'Docker',
                    testing: 'Testing'
                };
                codeTitle.textContent = `${skillNames[skill]} Code Example`;
                codeSnippetBlock.textContent = snippet.code;
                codeOutput.innerHTML = snippet.output || '';
                codeOutput.style.display = snippet.output ? 'block' : 'none';
                
                // Store skill for run button
                codeRunBtn.setAttribute('data-skill', skill);
                
                // Set Learn More link
                if (learnMoreBtn && snippet.resource) {
                    learnMoreBtn.href = snippet.resource.url;
                    learnMoreBtn.title = snippet.resource.description;
                    learnMoreBtn.style.display = 'inline-block';
                } else if (learnMoreBtn) {
                    learnMoreBtn.style.display = 'none';
                }
                
                codeModal.style.display = 'flex';
            }
        });
    });
}'''

# Find the start of the function
start_idx = content.find('function initCodeSnippets() {')
if start_idx == -1:
    print("ERROR: Could not find initCodeSnippets function!")
    exit(1)

# Find the end of the function (the closing brace at the same level)
brace_count = 0
end_idx = start_idx
in_function = False
for i in range(start_idx, len(content)):
    if content[i] == '{':
        brace_count += 1
        in_function = True
    elif content[i] == '}':
        brace_count -= 1
        if in_function and brace_count == 0:
            end_idx = i + 1
            break

# Replace the old function with the new one
if end_idx > start_idx:
    content = content[:start_idx] + new_function + content[end_idx:]
    
    # Write back
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✓ initCodeSnippets function updated with Learn More button handler!")
else:
    print("ERROR: Could not find function boundaries!")
