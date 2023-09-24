import { EventData, JoystickManager, JoystickOutputData } from "nipplejs";

export default class JoystickInstance {
    private static instance: JoystickInstance;

    private _manager!: JoystickManager;
    private _event: EventData | null;
    private _data: JoystickOutputData | null;
    private _joystickContainer: HTMLElement;

    constructor(manager: JoystickManager, container: HTMLDivElement) {
        JoystickInstance.instance = this;

        this._manager = manager;
        this._joystickContainer = container;
        this._event = null;
        this._data = null;

        const handleJoystickMove = (
            e: EventData,
            data: JoystickOutputData
        ): void => {
            this._event = e;
            this._data = data;
        };

        this._manager.on("start", handleJoystickMove);
        this._manager.on("move", handleJoystickMove);
        this._manager.on("end", handleJoystickMove);
    }

    public static getInstance(): JoystickInstance {
        return this.instance;
    }
    public get manager(): JoystickManager {
        return this._manager;
    }
    public get event(): EventData | null {
        return this._event;
    }
    public get data(): JoystickOutputData | null {
        return this._data;
    }
    public show(): void {
        this._joystickContainer.style.display = "block";
    }
    public hide(): void {
        this._joystickContainer.style.display = "none";
    }
}
