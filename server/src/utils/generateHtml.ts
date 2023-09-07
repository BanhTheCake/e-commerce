interface Html {
  username: string;
  linkToActive: string;
  label: string;
}

export const generateHtml = ({ username, linkToActive, label }: Html) => {
  return `<div style="background: #ffffff">
    <table
      align="center"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="
        background-color: #f8f8f8;
        background-repeat: repeat;
        font-family: Arial, sans-serif;
        font-size: 14px;
      "
    >
      <tbody>
        <tr>
          <td><div style="max-width: 60px; min-width: 20px"></div></td>
          <td
            style="
              padding-top: 30px;
              padding-right: 0;
              padding-left: 0;
              padding-bottom: 60px;
            "
          >
            <div style="max-width: 630px; min-width: 300px; margin: 0 auto">
              <div
                style="
                  margin-left: 5%;
                  margin-bottom: 15px;
                  height: 38px;
                  line-height: 38px;
                "
              >
                <p
                  style="
                    font-weight: semibold;
                    font-family: Arial, sans-serif;
                    font-size: 24px;
                  "
                >
                  BanhTheCake
                </p>
              </div>
              <table
                align="center"
                cellpadding="0"
                cellspacing="0"
                style="
                  border-color: #e6e6e6;
                  border-width: 1px;
                  border-style: solid;
                  background-color: #fff;
                  padding-top: 25px;
                  padding-right: 5%;
                  padding-bottom: 50px;
                  padding-left: 5%;
                "
                width="100%"
              >
                <tbody>
                  <tr>
                    <td style="padding: 0">
                      <span class="im">
                        <p
                          style="
                            font-family: Arial, sans-serif;
                            font-size: 19px;
                            margin-top: 14px;
                            margin-bottom: 0;
                          "
                        >
                          Hello,
                        </p>
  
                        <p
                          style="
                            font-family: Arial, sans-serif;
                            font-size: 15px;
                            line-height: 17px;
                            margin-top: 30px;
                            margin-bottom: 40px;
                          "
                        >
                          You are about to sign in to the account ${username} Here is
                          your link, please click the button below:
                        </p>
                      </span>
                      <table cellpadding="0" cellspacing="0" width="202">
                        <tbody>
                          <tr>
                            <td
                              width="202"
                              height="48"
                              style="
                                background-color: #ffdd39;
                                text-align: center;
                              "
                            >
                              <a
                                href="${linkToActive}"
                                style="
                                  display: block;
                                  font-family: Arial, sans-serif;
                                  font-size: 15px;
                                  text-align: center;
                                  width: 202px;
                                  color: #292929;
                                  text-decoration: none;
                                  font-weight: bold;
                                  border-radius: 6px;
                                "
                              >
                                <span style="font-size: 1.6em; text-transform:capitalize">${label}</span>
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <span class="im">
                        <p
                          style="
                            font-family: Arial, sans-serif;
                            font-size: 15px;
                            line-height: 17px;
                            margin-top: 30px;
                            margin-bottom: 30px;
                          "
                        >
                          Do not forward this email to anyone.
                        </p>
  
                        <p
                          style="
                            font-family: Arial, sans-serif;
                            font-size: 15px;
                            font-style: italic;
                            margin-top: 30px;
                            margin-bottom: 0;
                          "
                        >
                          We care about the safety of your account.<br /><br />
                          Sincerely,<br />
                          BanhTheCake team
                        </p>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <div class="adm">
                  <div id="q_5" class="ajR h4"><div class="ajT"></div></div>
                </div>
                <div class="h5">
                  <table
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="
                            padding-top: 12px;
                            background-image: url('https://ci4.googleusercontent.com/proxy/0ydGtz_zyAbpzoUFaWNdktnIHA5VklO0LFLjBUmBLLdIXOkYL5LABH0bed_rAQEh3jhonA-dbHNM-TpLtquLgl9UH_WzX-A2EBxjmeuBW7Ba8g=s0-d-e1-ft#https://yastatic.net/passport/_/GiCv5zMnyvmSWSkhAJff47-h7pk.png');
                            background-position: center;
                          "
                        ></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </td>
          <td><div style="max-width: 60px; min-width: 20px"></div></td>
        </tr>
      </tbody>
    </table>
  </div>
  `;
};
