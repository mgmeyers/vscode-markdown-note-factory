# Markdown Note Factory

This extension provides helpful commands for creating new markdown notes within a workspace. Shout out to [Markdown Notes for VS Code](https://github.com/kortina/vscode-markdown-notes), where most of this code was extracted from. 


## Features

`command`: `Note Factory: New Note`: Prompts for a note title and creates a note within the `newNoteDirectory` specified in the config. New notes are created using config settings: `fileNameFormat`, `defaultFileExtension`, and `noteTemplate`.

`command`: `Note Factory: New Note From Selection`: Prompts for a note title and extracts the currently selected text into the new note, leaving a link to the new note in its place. Links to extracted notes are created using the `selectionReplacementTemplate` config setting.


## Extension Settings

`defaultFileExtension`

`default`: `md`

The file extension to use when creating new markdown notes
    
---    

`fileNameFormat`

`default`: `as-is`

Determines the amount of processing applied when converting note titles to file names. slugged = convert to URL friendly slug; lowercase-slug = same as slugged but lowercased; as-is = strip out restricted characters, otherwise leave as is.

---    

`newNoteDirectory`

`default`: `SAME_AS_ACTIVE_NOTE`

The destination directory for new notes. Defaults to 'SAME_AS_ACTIVE_NOTE'; you can also use 'WORKSPACE_ROOT'; or a 'subdirectory/path' in the Workspace Root.

---    

`noteTemplate`

`default`: `# ${noteTitle}\n\n${noteContent}`,

Template to use when creating notes. Available tokens: ${noteTitle}, ${noteContent}, ${date}, ${timestamp}. Timestamp is inserted in ISO format, i.e. 2020-07-09T05:29:00.541Z.

---    

`selectionReplacementTemplate`

`default`: `[[${fileName}]]`

When creating a note from selected text, this template will take the place of the selected text in the origin document. Available tokens: ${absoluteFilePath}, ${relativeDirectoryPath}, ${fileExtension}, ${fileName}, ${fileNameWithExtension}, ${fileWorkspaceDirectory}.
