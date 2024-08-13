import axios from "axios";
import { decrypt, encrypt } from "./crypto";

interface Client {
  generateToken(_params: TokenParams): string;
  getContentWithToken(_token: string): Promise<ContentResponse>;
  getContent(_params: TokenParams): Promise<ContentResponse>;
  getRate(_targetUrl: string): Promise<RateResponse>;
  getAllTiles(): Promise<TileResponse[]>;
  getTile(
    _cuid: string,
    _parameters: {
      [key: string]: string | string[] | undefined | number;
    },
  ): Promise<TileResponse | null>;
}

export interface TileResponse {
  cuid: string;
  name: string;
  description: string;
  data?: string;
  inputParams: InputParamsResponse[] | null;
  furtherTopics: string;
  priceMicros: number;
  currency: string;
  embedUrl?: string;
}

export interface InputParamsResponse {
  cuid: string;
  name: string;
  description: string;
  type: string;
  required: string;
  enums: string[] | null;
}

export enum LicenseType {
  ON_DEMAND = "ON_DEMAND_LICENSE",
}

export type TokenParams = {
  url: string;
  maxPriceMicros: number;
  currency: string; // only supports USD for now
  licenseType: LicenseType;
};

type TokenStruct = {
  orgCuid: string;
  key: string;
  url: string;
  userAgent: string;
  maxPriceMicros: number;
  currency: string;
  licenseType: string;
};

type ContentResponse = {
  content: Content;
  metadata: string;
  rate: RateResponse;
};

type Content = {
  header: string;
  main: string;
  footer: string;
};

type RateResponse = {
  priceMicros: number;
  currency: string;
  licenseType: string;
  licensePath: string;
  error: string;
};

export class Tollbit implements Client {
  private secretKey: string;
  private userAgent: string;
  private organizationId: string;
  private baseUrl: string;

  constructor(
    secretKey: string,
    organizationId: string,
    userAgent: string,
    baseUrl?: string,
  ) {
    this.secretKey = secretKey;
    this.userAgent = userAgent;
    this.organizationId = organizationId;
    this.baseUrl = baseUrl || "https://api.tollbit.com";
  }

  /**
   * Generates a token for accessing content based on the provided parameters.
   * @param params - Token generation parameters.
   * @returns Encrypted token string.
   */
  public generateToken(params: TokenParams): string {
    const token: TokenStruct = {
      orgCuid: this.organizationId,
      key: this.secretKey,
      url: params.url,
      userAgent: this.userAgent,
      maxPriceMicros: params.maxPriceMicros,
      currency: params.currency,
      licenseType: params.licenseType,
    };

    const tokenString = JSON.stringify(token);

    const encryptedToken = encrypt(tokenString, this.secretKey);

    return encryptedToken;
  }

  /**
   * Retrieves content using a valid token.
   * @param token - Encrypted token string.
   * @returns Promise that resolves to the content response.
   */
  public async getContentWithToken(token: string): Promise<ContentResponse> {
    const decryptedToken = decrypt(token, this.secretKey);
    const t: TokenStruct = JSON.parse(decryptedToken);

    let tollbitUrl = t.url.replace(/^https?:\/\//, "");
    tollbitUrl = tollbitUrl.replace(/^www\./, "");
    tollbitUrl = `https://api.tollbit.com/dev/v1/content/${tollbitUrl}`;

    const headers = {
      TollbitOrgCuid: t.orgCuid,
      "User-Agent": `Mozilla/5.0 (compatible; ${this.userAgent}; +https://tollbit.com/bot)`,
      TollbitToken: token,
    };

    const response = await axios.get(tollbitUrl, { headers });

    const contentResponse: ContentResponse[] = response.data;
    if (
      contentResponse.length === 0 ||
      contentResponse?.[0]?.content == null ||
      contentResponse[0]?.content?.main === ""
    ) {
      throw new Error("Could not get content");
    }

    return contentResponse[0] as ContentResponse;
  }

  /**
   * Retrieves content using the specified parameters.
   * @param params - Token generation parameters.
   * @returns Promise that resolves to the content response.
   */
  public async getContent(params: TokenParams): Promise<ContentResponse> {
    const token = this.generateToken(params);

    const contentResponse = this.getContentWithToken(token);

    return contentResponse;
  }

  /**
   * Retrieves the rate for accessing content from the target URL.
   * @param targetUrl - Target URL for which to retrieve the rate.
   * @returns Promise that resolves to the rate response.
   */
  public async getRate(targetUrl: string): Promise<RateResponse> {
    let tollbitUrl = targetUrl.replace(/^https?:\/\//, "");
    tollbitUrl = tollbitUrl.replace(/^www\./, "");
    tollbitUrl = `https://api.tollbit.com/dev/v1/rate/${tollbitUrl}`;

    const headers = {
      "User-Agent": `Mozilla/5.0 (compatible; ${this.userAgent}; +https://tollbit.com/bot)`,
    };

    const response = await axios.get(tollbitUrl, { headers });

    const rateResponse: RateResponse[] = response.data;
    if (rateResponse.length === 0) {
      throw new Error("Could not get rate");
    }

    return rateResponse[0] as RateResponse;
  }

  /**
   * Gets all tiles available to the given agent
   * @returns Promise that resolves to an array of TileResponses.
   */
  public async getAllTiles(): Promise<TileResponse[]> {
    if (!this.secretKey) {
      throw new Error("Secret key is not set");
    }

    const headers = {
      TollbitKey: this.secretKey,
      "Content-Type": "application/json",
    };

    const response = await axios(`${this.baseUrl}/dev/v1/allTiles`, {
      headers,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  }

  /**
   * Given a cuid for a tile, returns the fully resolved tile
   * @returns Promise that resolves to an array of TileResponses.
   */
  public async getTile(
    cuid: string,
    parameters: { [key: string]: string | string[] | undefined | number },
  ): Promise<TileResponse | null> {
    if (!this.secretKey) {
      throw new Error("Secret key is not set");
    }

    const headers = {
      TollbitKey: this.secretKey,
      "Tollbit-User-Agent": this.userAgent,
      "Content-Type": "application/json",
    };

    let url = `${this.baseUrl}/tiles/v1/tile/${cuid}`;
    if (parameters) {
      const params = new URLSearchParams(parameters as Record<string, string>);
      url += `?${params.toString()}`;
    }
    const response = await axios(url, {
      headers,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = response.data;

    if (!data || data?.length === 0) {
      return null;
    }

    return data?.[0];
  }
}
