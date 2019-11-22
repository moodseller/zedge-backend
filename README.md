## Running

1. Install dependencies `yarn install` or `yarn`
2. Run `yarn start:dev`

## Testing

1. `yarn test`, `yarn test:watch`

Testing does not cover all the points (failed exceptions), but mainly the functionallity.

Refrained from testing itunes service as it is dependent on third party API and can fail the pipeline (if there is one) when the project itself runs fine.


## Conclusion

I had problems understanding whether only `search` or `lookup` needed to be implemented therefore I added both with my own understanding on how the application should behave and what entities on `lookup` call should be retrieved in order to match a similar response model.

`ClientService.ts` file holds the logic for user "authorization" and client list.

Normally with Typescript I use a private package or a synchronization tool to determine API's requests and responses interfaces, however in this case for convenience I chose to copy and paste between the two projects to avoid installation issues when showcasing.