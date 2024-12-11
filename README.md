# Simulating accessibility personas

Chrome extension for simulating the [accessibility personas](https://github.com/alphagov/accessibility-personas) that were created by the UK Government Digital Service (GDS) and adapted by Germany's [DigitalService GmbH des Bundes](https://digitalservice.bund.de/). This is a work in progress. Feedback and contributions are welcome.

The extension simulates various impairments (e.g, low vision, dyslexia) by injecting CSS and JS files to the currently active tab. Most CSS and JS files were taken directly from the GDS repo, some were slightly modified.

## Usage

Select a persona from the extension and the current browser tab will be adjusted to simulate the persona's experience.

<img src="images/screenshot.png" alt="Screenshot of the extension" width="300" >

For some personas, you will need to install additional extensions at this point, or change your system settings (e.g., activate VoiceOver on your Mac). This is mentioned in the additional instructions for each persona.

## Installation

1. Download this repository as a ZIP file. Unzip it.

2. Open Google Chrome and navigate to `chrome://extensions/`.

3. Activate "Developer mode" in the top-right corner.

4. Select "Load unpacked" and select the folder you downloaded from here.

5. Pin the extension (📍) to keep it visible.

## Development

Install the project dependencies once using `npm`. To do that, [Node.js](https://nodejs.org/en) needs to be installed on your machine. We recommend to use a version manager to handle Node.js versions, [asdf](https://asdf-vm.com/guide/getting-started.html) with the [asdf-nodejs](https://github.com/asdf-vm/asdf-nodejs/) plugin, for example.

```bash
npm install
```

Additionally, we use [lefthook](https://github.com/evilmartians/lefthook) Git hooks which can be installed with brew:

```sh
brew install lefthook
```

### Verify that your code changes are correctly formatted

Run `npm run format:check` and afterwards `npm run format:fix` to auto format your code changes with [Prettier](https://prettier.io/).
A `pre-commit` lefthook Git hook will take care of checking your code before you can push it.

### Build CSS with Tailwind

Use `npm run tailwind` to build the CSS file and watch for changes.

## Contributing

[Deutsche sprache weiter unten](#mitwirken)

Everyone is welcome to contribute! You can contribute by giving feedback, adding issues, answering questions, providing documentation or opening pull requests. Please always follow the guidelines and our [Code of Conduct](CODE_OF_CONDUCT.md).

To contribute code, simply open a pull request with your changes and it will be reviewed by someone from the team. By submitting a pull request you declare that you have the right to license your contribution to the DigitalService and the community under the license picked by the project.

## Mitwirken

Jede:r ist herzlich eingeladen, die Entwicklung der _Project_ mitzugestalten. Du kannst einen Beitrag leisten, indem du Feedback gibst, Probleme beschreibst, Fragen beantwortest, die Dokumentation erweiterst, oder Pull-Requests eröffnest. Bitte befolge immer die Richtlinien und unseren [Verhaltenskodex](CODE_OF_CONDUCT.md).

Um Code beizutragen erstelle einfach einen Pull Requests mit deinen Änderungen, dieser wird dann von einer Person aus dem Team überprüft. Durch das Eröffnen eines Pull-Requests erklärst du ausdrücklich, dass du das Recht hast deine Beitrag an den DigitalService und die Community unter der vom Projekt gewählten Lizenz zu lizenzieren.
