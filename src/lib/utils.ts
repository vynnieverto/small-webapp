import { isValidPlatform } from "./regions";

type ValidationResult =
     {
      ok: boolean;
      status: number;
      body: {error: string };
    };

export function isValidPlayerInfo(gameName: string, tagLine: string, region: string): ValidationResult {

    if (gameName.length < 3 || gameName.length > 16) {
    return {
        ok: false,
        status: 400,
        body: { error: 'Game name must be between 3 and 16 characters'},
        };
    }
    else if (tagLine.length < 3 || tagLine.length > 5) {
        return {
            ok: false,
            status: 400,
            body: { error: 'Tag line must be between 3 and 5 characters' },
        };
    }

    if (!isValidPlatform(region)) {
        return {
            ok: false,
            status: 400,
            body: { error: 'Invalid platform' },
        };
    }

    return {
        ok: true,
        status: 200,
        body: {error: ''}

    }

}