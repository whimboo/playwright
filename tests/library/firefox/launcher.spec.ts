/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { playwrightTest as it, expect } from '../../config/browserTest';

it('should pass firefox user preferences', async ({ browserType, mode, server }) => {
  it.skip(mode.startsWith('service'));

  const browser = await browserType.launch({
    firefoxUserPrefs: {
      'javascript.enabled': false,
    }
  });

  server.setRoute('/empty.html', async (req, res) => {
    res.end(`<script>window.testStatus = 'SUCCESS';</script>`);
  });

  const page = await browser.newPage();
  await page.goto(server.EMPTY_PAGE);

  expect(await page.evaluate(() => window['testStatus'])).toBe(undefined);
  await browser.close();
});

it('should pass firefox user preferences in persistent', async ({ mode, launchPersistent, server }) => {
  it.skip(mode.startsWith('service'));

  const { page } = await launchPersistent({
    firefoxUserPrefs: {
      'javascript.enabled': false,
    }
  });

  server.setRoute('/empty.html', async (req, res) => {
    res.end(`<script>window.testStatus = 'SUCCESS';</script>`);
  });

  await page.goto(server.EMPTY_PAGE);
  expect(await page.evaluate(() => window['testStatus'])).toBe(undefined);
});
