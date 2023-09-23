import nipplejs, {
    EventData,
    JoystickManager,
    JoystickOutputData,
} from "nipplejs";

export default class JoystickInstance {
    private static instance: JoystickInstance;

    private _manager!: JoystickManager;
    private _event: EventData | null;
    private _data: JoystickOutputData | null;
    private _joystickContainer: HTMLElement;

    constructor(joystickContainer: HTMLElement) {
        JoystickInstance.instance = this;

        this._joystickContainer = joystickContainer;
        this._event = null;
        this._data = null;

        // this._manager = nipplejs.create({
        //     zone: joystickContainer,
        //     // size: 100 * (window.innerHeight / 720),
        //     mode: "static",
        //     position: { top: "50%", left: "50%" },
        // });

        // const handleJoystickMove = (
        //     e: EventData,
        //     data: JoystickOutputData
        // ): void => {
        //     this._event = e;
        //     this._data = data;
        // };

        // this._manager.on("start", handleJoystickMove);
        // this._manager.on("move", handleJoystickMove);
        // this._manager.on("end", handleJoystickMove);
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