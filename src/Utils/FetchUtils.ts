import { BybitEndPointUrl, BybitRestEndPoint } from "../Exchanges/Bybit/Enums";

export class FetchUtils {
  static createRestUrl(endPoint) {
    let url = `${BybitEndPointUrl.MainnetRestServer1}${endPoint}`;

    //--- use this chrome plugin to get arround the cors problem when running on local development server
    //--- https://mybrowseraddon.com/access-control-allow-origin.html

    const USECORS = false;
    const CORSSERVER = "https://cors-anywhere.herokuapp.com/";

    if (USECORS) {
      url = `${CORSSERVER}${url}`;
    }

    return url;
  }
}
