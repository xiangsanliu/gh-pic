/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Github Token - Your Github Token. */
  "githubToken": string,
  /** Repo Name - Github Repository name. */
  "repo": string,
  /** Repo Owner - Owner of Github Repository. */
  "owner": string,
  /** Committer - Username to display in commit message. */
  "committer": string,
  /** Email - Email of committer. */
  "email": string,
  /** Path of Repo - Path to store pictures in repo. */
  "path": string,
  /** Full Path to pngpaste - Full Path to pngpaste */
  "pngpastePath": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `index` command */
  export type Index = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `index` command */
  export type Index = {}
}

