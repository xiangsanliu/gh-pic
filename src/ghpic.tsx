import { List, ActionPanel, Action, getPreferenceValues, Icon } from "@raycast/api";
import { useState } from "react";
import { Octokit } from "@octokit/core";
import { RequestError } from "@octokit/request-error";
import * as fs from 'fs';
import dayjs from "dayjs";
import { execaSync } from "execa";

const DEFAULT_PNGPASTE_PATH = "/opt/homebrew/bin/pngpaste";
const TEMP_PIC_PATH = "/tmp/GHPicTemp.jpgimage.png";

interface Preferences {
  githubToken: string;
  owner: string;
  repo: string;
  path: string;
  email: string;
  pngPastePath: string;
}

const preferences = getPreferenceValues<Preferences>();

// Github Auth
const octokit = new Octokit({ auth: preferences.githubToken });

type resultDto = {
  errorCode: number;
  errorMsg: string;
  picUrl: string;
  helpUrl: string;
  icon: Icon
}

/**
 * Upload pic to github.
 * @returns res
 */
async function uploadPic() {
  const res = {
    errorCode: 0,
    errorMsg: "success",
    picUrl: "",
    icon: Icon.CircleProgress100,
    helpUrl: "https://github.com/xiangsanliu/GHPicimage"
  };
  try {
    // Paste pic from clipboard to Temp folder.
    execaSync(preferences.pngPastePath, [TEMP_PIC_PATH]);

    const pic = fs.readFileSync(TEMP_PIC_PATH);
    const content = Buffer.from(pic).toString('base64');
    const path = `${preferences.path}/${dayjs().format('YYYY-MM-DDTHH:mm:ss')}.jpg`

    // Upload pic to github.
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: preferences.owner,
      repo: preferences.repo,
      path: path,
      message: 'Upload by GHPic.',
      committer: {
        name: preferences.owner,
        email: preferences.email
      },
      content: content
    });
    res.picUrl = `https://cdn.jsdelivr.net/gh/${preferences.owner}/${preferences.repo}/${path}`;
  } catch (error) {
    res.icon = Icon.Multiply;
    if (error instanceof RequestError) {
      res.errorCode = 1;
      res.errorMsg = 'Upload image to Github failed, press Enter for help.';
    } else {
      res.errorCode = 2;
      res.errorMsg = 'Paste image from clipboard failed, press Enter for help.';
    }
    console.log(error)
  }
  return res;
}

export default function Command() {
  const [res, setRes] = useState<resultDto>({
    errorCode: 4,
    errorMsg: "Uploading...",
    picUrl: "",
    icon: Icon.CircleProgress50,
    helpUrl: "https://github.com/xiangsanliu/GHPic"
  });
  const [loaded, setLoaded] = useState(false);
  if (preferences.path == undefined) {
    preferences.path = "";
  } else if (preferences.path.endsWith("/")) {
    preferences.path = preferences.path.substring(0, preferences.path.length - 1);
  } else if (preferences.path.startsWith("/")) {
    preferences.path = preferences.path.substring(1);
  }
  if (preferences.pngPastePath == undefined) {
    preferences.pngPastePath = DEFAULT_PNGPASTE_PATH;
  }
  uploadPic().then(res => {
    setRes(res);
    setLoaded(true);
  })
  return (
    <List isLoading={loaded}>
      {res.errorCode == 0 ? (
        <>
          <List.Item title={'MarkDown'} actions={
            <ActionPanel>
              <Action.CopyToClipboard content={`![](${res.picUrl})`} />
            </ActionPanel>
          } />
          <List.Item title={'URL'} actions={
            <ActionPanel>
              <Action.CopyToClipboard content={res.picUrl} />
            </ActionPanel>
          } />
        </>
      ) :
        <>
          <List.Item title={res.errorMsg} icon={res.icon} actions={
            <ActionPanel>
              <Action.OpenInBrowser url={res.helpUrl} />
            </ActionPanel>
          } />
        </>}
    </List>
  )
}
