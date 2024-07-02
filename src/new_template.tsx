function filterTextByConditions(text: string, conditions: { [key: string]: string }): string {
    // Split the text into sections based on the condition markers
    const sections = text.split(/<% end if %>/);

    // Initialize an array to store the valid sections
    let validSections: string[] = [];

    sections.forEach(section => {
        // Extract conditions from the section
        const conditionMatches = section.match(/<%.*?%>/g);

        // Check if the section has no conditions
        if (!conditionMatches) {
            if (section.trim()) {
                validSections.push(section.trim());
            }
            return;
        }

        // Extract the conditions as key-value pairs
        const sectionConditions = conditionMatches.map(condition => {
            const [key, value] = condition.replace(/[<%>%]/g, '').trim().split('=');
            return { key, value };
        });

        // Check if the section conditions match the provided conditions
        const isValidSection = sectionConditions.every(sc => {
            return conditions[sc.key] === sc.value;
        });

        if (isValidSection) {
            // Remove condition markers and add the section to valid sections
            validSections.push(section.replace(/<%.*?%>/g, '').trim());
        }
    });

    // Join the valid sections into a single string with a single newline separating them and return
    return validSections.join('\n\n');
}

// Test the function with the provided text and conditions
const text = `
<% type=company %>
Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad perferendis, eum illum ullam quibusdam maxime voluptatem
fuga illo cumque dolorum, vel commodi, harum amet! Fugiat, error asperiores. Eius, quo similique with type company.
<% end if %>

<% type=individual %> 
Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque voluptates consequuntur repudiandae non a dignissimos
temporibus quod culpa, fugit rerum vero et, minima commodi deserunt accusantium blanditiis autem consectetur impedit with type individual.
<% end if %>

<% approve=true %>
Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error autem, quia at aspernatur ad beatae possimus quasi
deleniti provident ducimus repellat nemo, ipsam nulla? Provident exercitationem accusamus laborum error possimus! with approve true
<% end if %>

<% approve=false %>
Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit ab in veritatis dolorem et qui officiis dicta
inventore aspernatur natus corrupti sit alias molestiae, est incidunt dolores, magnam ea. Sint. With approve false.
<% end if %>

<% type=company %>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi viverra dictum neque, mollis sollicitudin ante consectetur at. Aenean aliquet leo in tristique sollicitudin. Sed lacus arcu, sagittis vitae justo ac, pulvinar porta erat. Donec at fringilla leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras et nibh nisi. Etiam gravida metus vitae mi ultricies, eu laoreet mauris posuere. Vivamus urna urna, semper posuere leo a, suscipit egestas ipsum. Aenean a nisi in ante ornare vestibulum. Vestibulum mauris metus, facilisis ut fermentum at, iaculis dignissim augue. With type company
<% end if %>

This section has no conditions and should be included in the result regardless of conditions.

Another section with no conditions that should also be included.`;

const conditions = {
    type: 'individual',
    approve: 'false',
};


console.log(filterTextByConditions(text, conditions));