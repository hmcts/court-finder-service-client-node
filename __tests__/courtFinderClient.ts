import * as fs from 'fs'
import * as nock from 'nock'
import * as path from 'path'
import { AreaOfLaw, CourtFinderClient, CourtFinderResponse } from '../src'

const mockClient = 'http://localhost'
const courtFinderClient: CourtFinderClient = new CourtFinderClient(mockClient)

const expectedResponse = {
    courts: [
        {
            address: {
                addressLines: [
                    'The Priory Courts',
                    '33 Bull Street'
                ],
                postcode: 'B4 6DU',
                town: 'Birmingham',
                type: 'Visiting'
            },
            areasOfLaw: [
                {
                    externalLink: 'https%3A//www.gov.uk/wills-probate-inheritance',
                    externalLinkDescription: 'Information about wills and probate',
                    name: 'Probate'
                }
            ],
            cciCode: null,
            courtNumber: null,
            distance: 1,
            dxNumber: '701990 Birmingham 7',
            lat: 52.4816613587661,
            lon: -1.89552893773996,
            magistrateCode: null,
            name: 'Birmingham District Probate Registry',
            slug: 'birmingham-district-probate-registry',
            types: []
        }
    ], statusCode: 200, valid: true
}

describe('CourtFinderClient', () => {
    describe('findCourtByPostcode', () => {
        test('should return valid false if no court found', () => {
                nock(mockClient)
                    .get(/\/search\/results.json\?postcode=.+&aol=.+/)
                    .reply(404, [])

                return courtFinderClient.findCourtByPostcode('A111AA', AreaOfLaw.ALL)
                    .then((courtResponse: CourtFinderResponse) => {
                        expect(courtResponse).toEqual({ courts: [], statusCode: 404, valid: false })
                    })
            }
        )

        test('should return found courts', () => {
                nock(mockClient)
                    .get(/\/search\/results.json\?postcode=.+&aol=.+/)
                    .reply(200, fs.readFileSync(path.join(__dirname, 'courtFinderClientAll.json')))
                return courtFinderClient.findCourtByPostcode('A111AA', AreaOfLaw.ALL)
                    .then((courtResponse: CourtFinderResponse) => {
                        expect(courtResponse).toEqual(expectedResponse)
                    })
            }
        )

        test('should reject promise if no postcode', () =>
            expect(courtFinderClient.findCourtByPostcode('', AreaOfLaw.ALL)).rejects.toEqual('Missing postcode')
        )
    })

    describe('findCourtByAddress', () => {
        test('should return valid false if no court found', () => {
                nock(mockClient)
                    .get(/\/search\/results.json\?q=.+/)
                    .reply(404, [])

                return courtFinderClient.findCourtByAddress('jfmkdsoagjdflgjnjfldksgnjflds')
                    .then((courtResponse: CourtFinderResponse) => {
                        expect(courtResponse).toEqual({ courts: [], statusCode: 404, valid: false })
                    })
            }
        )

        test('should return found courts', () => {
                nock(mockClient)
                    .get(/\/search\/results.json\?q=.+/)
                    .reply(200, fs.readFileSync(path.join(__dirname, 'courtFinderClientAll.json')))
                return courtFinderClient.findCourtByAddress('A111AA')
                    .then((courtResponse: CourtFinderResponse) => {
                        expect(courtResponse).toEqual(expectedResponse)
                    })
            }
        )

        test('should reject promise if no address', () =>
            expect(courtFinderClient.findCourtByAddress('')).rejects.toEqual('Missing address')
        )
    })
})
