# Markdown Note Factory

This extension provides helpful commands for creating new markdown notes within a workspace. Shout out to [Markdown Notes for VS Code](https://github.com/kortina/vscode-markdown-notes), where most of this code was extracted from.

## Features

`command`: `Note Factory: New Note`: Prompts for a note title and creates a note within the `newNoteDirectory` specified in the config. New notes are created using config settings: `fileNameFormat`, `defaultFileExtension`, and `noteTemplate`.

`command`: `Note Factory: New Note From Selection`: Prompts for a note title and extracts the currently selected text into the new note, leaving a link to the new note in its place. Links to extracted notes are created using the `selectionReplacementTemplate` config setting.

You can also access this command from the context menu:

<img src="https://github.com/mgmeyers/vscode-markdown-note-factory/raw/main/assets/context-menu.png" alt="Context menu showing New Note From Selection command" width="233" />

## Extension Settings

### `dateFormat`

`default`: `yyyy-MM-dd`

A date format string to control the \${date} token output in templates. See date-fns for formatting options: https://date-fns.org/v2.16.1/docs/format

### `defaultFileExtension`

`default`: `md`

The file extension to use when creating new markdown notes

### `fileNameFormat`

`default`: `as-is`

Determines the amount of processing applied when converting note titles to file names. slugged = convert to URL friendly slug; lowercase-slug = same as slugged but lowercased; as-is = strip out restricted characters, otherwise leave as is.

### `newNoteDirectory`

`default`: `SAME_AS_ACTIVE_NOTE`

The destination directory for new notes. Defaults to 'SAME_AS_ACTIVE_NOTE'; you can also use 'WORKSPACE_ROOT'; or a 'subdirectory/path' in the Workspace Root.

### `noteTemplate`

`default`: `# ${noteTitle}\n\n${noteContent}`,

Template to use when creating notes. Available tokens: ${noteTitle}, ${noteContent}, ${date}, ${timestamp}. Timestamp is inserted in ISO format, i.e. 2020-07-09T05:29:00.541Z.

### `noteTemplateFile`

`default`: ``

Path to note template file. This path may be absolute or relative to the workspace root. If present, the template file will be used instead of the Note Template setting. Available tokens: ${noteTitle}, ${noteContent}, ${date}, ${timestamp}. Timestamp is inserted in ISO format, i.e. 2020-07-09T05:29:00.541Z.

#### Example

Say you have this template in your workspace

`assets/my-note-template.md`

```
# ${noteTitle}

## Created on
${date}

## Content
${noteContent}
```

To use this template, you would set `noteTemplateFile` to `assets/my-note-template.md`

Alternatively, you can point to a file anywhere on your disk using an absolute path like `/Users/my-name/Documents/my-note-template.md`

### `selectionReplacementTemplate`

`default`: `[[${fileName}]]`

When creating a note from selected text, this template will take the place of the selected text in the origin document. Available tokens: ${absoluteFilePath}, ${relativeDirectoryPath}, ${fileExtension}, ${fileName}, ${fileNameWithExtension}, ${fileWorkspaceDirectory}, ${date}, ${timestamp}.
