import fetch from "node-fetch";
import type { ExtensionContext } from "vscode";
import { window, workspace } from "vscode";
import { FILE, MSG_PREFIX, URL_PREFIX } from "./constants";
import { getConfig } from "./config";

export async function fetchLatest(): Promise<string[]> {
  const repo = getConfig<string>("cSpell.tech.upstreamRepo");
  const branch = getConfig<string>("cSpell.tech.upstreamBranch");
  const url = `${URL_PREFIX}/${repo}@${branch}/${FILE}`;
  const md = await fetch(url).then(r => r.text());
  const content = (md.match(/```jsonc([\s\S]*?)```/) || [])[1] || "";

  const json = `{${
    content
    .trim()
    .split(/\n/g)
    .filter(line => !line.trim().startsWith("//"))
    .join("\n")
    .slice(0, -1)
  }}`;

  const config = JSON.parse(json) || [];
  return config["cSpell.userWords"];
}

export async function fetchAndUpdate(ctx: ExtensionContext, prompt = true) {
  const patterns = await fetchLatest();
  let shouldUpdate = true;

  if (prompt && Date.parse(patterns[0]) > Date.parse(ctx.globalState.get("lastUpdate", "0"))) {
    const buttonUpdate = "Update";
    const buttonSkip = "Skip this time";
    const result = await window.showInformationMessage(
      `${MSG_PREFIX} new config found, do you want to update?`,
      buttonUpdate,
      buttonSkip,
    );
    shouldUpdate = result === buttonUpdate;
  }

  if (shouldUpdate) {
    const config = workspace.getConfiguration();
    config.update("cSpell.userWords", [
      new Date().toISOString(),
      ...patterns,
    ], true);

    ctx.globalState.update("lastUpdate", Date.now());

    window.showInformationMessage(`${MSG_PREFIX} Config updated`);
  }
}
