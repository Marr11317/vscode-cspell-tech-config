import fetch from "node-fetch";
import type { ExtensionContext } from "vscode";
import { window, workspace } from "vscode";
import { FILE, MSG_PREFIX, URL_PREFIX } from "./constants";
import { getConfig } from "./config";

export async function fetchLatest(): Promise<{ config: string[]; lastUpdated: number }> {
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
  // Extract the date from the top comment "// updated 2022-09-10 20:46" <- iso date
  const updateStr = "// updated ";
  const lastUpdated = Date.parse(content.slice(content.indexOf(updateStr) + updateStr.length, content.indexOf("\n")));

  const config = JSON.parse(json) || [];
  return { config: config["cSpell.userWords"], lastUpdated };
}

/** @returns `true` if it updated the config. `false` if no new config was available or the user denied the request */
export async function fetchAndUpdate(ctx: ExtensionContext, prompt = true): Promise<boolean> {
  const fetched = await fetchLatest();
  const config = workspace.getConfiguration();
  const newVersionAvailable = fetched.lastUpdated > (Date.parse((config.get("cSpell.userWords") as string[])[0]) || 0);
  if (!newVersionAvailable)
    return false;

  let shouldUpdate = true;

  if (prompt) {
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
    config.update("cSpell.userWords", [
      new Date().toISOString(),
      ...fetched.config,
    ], true);

    ctx.globalState.update("lastUpdate", Date.now());

    window.showInformationMessage(`${MSG_PREFIX} Config updated`);
  }

  return shouldUpdate;
}
