<br>

<p align="center">
<img src="https://raw.githubusercontent.com/antfu/vscode-file-nesting-config/main/extension/res/logo.png" style="width:100px;" />
</p>

<h1 align="center">CSpell Tech Updater</h1>

<p align="center">
Auto Updater for your CSpell config
</a>.

<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=RemiMarche.cspell-tech" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/RemiMarche.cspell-tech.svg?color=blue&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
</p>

## Configurations

```json
{
  "cSpellTechUpdater.autoUpdate": true,
  "cSpellTechUpdater.autoUpdateInterval": 720,
  "cSpellTechUpdater.promptOnAutoUpdate": true,
  "cSpellTechUpdater.upstreamRepo": "antfu/vscode-file-nesting-config",
  "cSpellTechUpdater.upstreamBranch": "main"
}
```

It will check for updates every 12 hours by default. You can also do it manually by executing the command `CSpell Tech` Updater: Update config now`.

## License

MIT
