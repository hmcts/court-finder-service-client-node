# court-finder-service-client-node

API Client wrapper for [Court and Tribunal finder API](https://courttribunalfinder.service.gov.uk/api.html).

# Usage

## Quick start
```bash
$ yarn add @hmcts/court-finder-service-client
```

Typescript:
```ts
import { CourtFinderClient } from '@hmcts/court-finder-service-client'

new CourtFinderClient().findCourtByPostcode("A11 1AA", "Money Claims")
```

- Javascript -

```js
const CourtFinderClient = require('@hmcts/court-finder-service-client').CourtFinderClient

new CourtFinderClient().findCourtByAddress("Old Bailey")
```
