#!/usr/bin/env python3
import re

# Read the script.js file
with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Define resource links for each skill
resources = {
    'htmlcss': {
        'url': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        'desc': 'Learn semantic HTML structure, accessibility, and modern CSS techniques from Mozilla\'s comprehensive guides.'
    },
    'javascript': {
        'url': 'https://javascript.info',
        'desc': 'Master JavaScript fundamentals with interactive tutorials, from basic syntax to advanced async/await patterns.'
    },
    'react': {
        'url': 'https://react.dev',
        'desc': 'Learn React from the official documentation. Build interactive UIs with hooks, state management, and component best practices.'
    },
    'responsive': {
        'url': 'https://web.dev/responsive-web-design-basics/',
        'desc': 'Master responsive design techniques. Learn mobile-first approach, flexbox, CSS grid, and media queries for all devices.'
    },
    'nodejs': {
        'url': 'https://nodejs.org/docs/',
        'desc': 'Learn Node.js server-side development. Build REST APIs, handle async operations, and create scalable backend applications.'
    },
    'python': {
        'url': 'https://python.org/about/gettingstarted/',
        'desc': 'Learn Python programming from basics to advanced. Explore data structures, functions, and build real-world projects.'
    },
    'database': {
        'url': 'https://www.w3schools.com/sql/',
        'desc': 'Master database design and SQL queries. Learn database management, optimization, and best practices for data storage.'
    },
    'api': {
        'url': 'https://restfulapi.net/',
        'desc': 'Understand REST API design principles. Learn proper HTTP methods, status codes, and create well-designed APIs.'
    },
    'git': {
        'url': 'https://git-scm.com/doc',
        'desc': 'Learn Git version control thoroughly. Master branching, merging, collaboration workflows, and best practices for teams.'
    },
    'agile': {
        'url': 'https://agilemanifesto.org/',
        'desc': 'Understand Agile methodology and iterative development. Learn sprint planning, standups, and team collaboration practices.'
    },
    'docker': {
        'url': 'https://docs.docker.com/',
        'desc': 'Learn containerization with Docker. Build, deploy, and manage containers for consistent development and production environments.'
    },
    'testing': {
        'url': 'https://jestjs.io/docs/getting-started',
        'desc': 'Master automated testing with Jest. Learn unit testing, integration testing, and mocking for reliable code quality.'
    }
}

# Update each skill snippet to add resource
for skill, resource in resources.items():
    # Find the closing brace pattern for each skill
    pattern = rf"({skill}:\s*\{{.*?output:\s*`.+?`)\s*\}}"
    
    def replace_func(match):
        old_text = match.group(1)
        resource_block = f''',
        resource: {{ 
            url: '{resource['url']}',
            description: '{resource['desc']}'
        }}'''
        return old_text + resource_block + '\n    }'
    
    content = re.sub(pattern, replace_func, content, flags=re.DOTALL)

# Write back the updated script
with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ All skills updated with resource links!")
print("\nResources added for:")
for skill in resources.keys():
    print(f"  - {skill}")
