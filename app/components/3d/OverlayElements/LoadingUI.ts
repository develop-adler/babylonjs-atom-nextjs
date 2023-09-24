import { DefaultLoadingScreen } from "@babylonjs/core";

class LoadingUI {
    private _loadingDiv!: HTMLDivElement;
    private _loadingGif!: HTMLImageElement;

    constructor() {
        DefaultLoadingScreen.prototype.displayLoadingUI = () => {
            if (document.getElementById("customLoadingScreenDiv")) {
                // Do not add a loading screen if there is already one
                document.getElementById("customLoadingScreenDiv")!.style.display =
                    "initial";
                return;
            }
            this._loadingDiv = document.createElement("div");
            this._loadingDiv.id = "customLoadingScreenDiv";
            const customLoadingScreenCss = document.createElement("style");
            customLoadingScreenCss.innerHTML = `
                #customLoadingScreenDiv {
                    position: relative;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #1d1d1d;
                    padding: 0;
                    border: none;
                    outline: none;
                    overflow: hidden;
                    z-index: 1000;
                }
            `;
            document
                .getElementsByTagName("head")[0]
                .appendChild(customLoadingScreenCss);
            document.body.appendChild(this._loadingDiv);

            this._loadingGif = document.createElement("img");
            this._loadingGif.id = "customLoadingScreenGif";
            this._loadingGif.src = "/loading.gif";
            this._loadingGif.alt = "Loading...";
            const customLoadingScreenGifCss = document.createElement("style");
            customLoadingScreenGifCss.innerHTML = `
                .customLoadingScreenGif {
                    position: relative;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 10rem;
                    height: auto;
                    user-select: none;
                    pointer-events: none;
                }
            `;
            document
                .getElementsByTagName("head")[0]
                .appendChild(customLoadingScreenGifCss);

                this._loadingDiv.appendChild(this._loadingGif);
        };

        DefaultLoadingScreen.prototype.hideLoadingUI = () => {
            document.getElementById("customLoadingScreenDiv")!.style.display = "none";
        };
    }
}

export default LoadingUI;
