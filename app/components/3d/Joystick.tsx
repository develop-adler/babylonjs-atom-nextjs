import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import nipplejs, {
    EventData,
    JoystickManager,
    JoystickOutputData,
} from "nipplejs";
import { JOYSTICK_DATA } from "@/app/utils/global";

const JoystickContainer = styled.div`
  position: absolute;
  bottom: 15%;
  left: 15%;
  z-index: 2;
  scale: 1.5;

  @media screen and (max-width: 768px) {
    left: 25%;
    scale: 1.25;
  }
  transition: all 0.4s ease-in-out;
`;

export class JoystickInstance {
    private static instance: JoystickInstance;

    private _manager!: JoystickManager;
    private _event: EventData | null = null;
    private _data: JoystickOutputData | null = null;
    private _joystickContainer: HTMLElement;

    constructor(joystickContainer: HTMLElement) {
        JoystickInstance.instance = this;

        this._joystickContainer = joystickContainer;

        if (typeof window !== undefined) {
            this._manager = nipplejs.create({
                zone: joystickContainer,
                // size: 100 * (window.innerHeight / 720),
                mode: "static",
                position: { top: "50%", left: "50%" },
            });
            this._event = null!;
            this._data = null!;

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
    }

    public static getInstance(): JoystickInstance {
        return this.instance;
    }
    public get manager(): JoystickManager {
        return this._manager;
    }
    public get event(): EventData {
        return this._event;
    }
    public get data(): JoystickOutputData {
        return this._data;
    }
    public show(): void {
        this._joystickContainer.style.display = "block";
    }
    public hide(): void {
        this._joystickContainer.style.display = "none";
    }
}

const Joystick = (): React.JSX.Element => {
    const joystickContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!joystickContainerRef.current) return;

        const joystick = new JoystickInstance(joystickContainerRef.current);
        return () => joystick.manager.destroy();
    }, []);

    return <JoystickContainer ref={joystickContainerRef} />;
};

export default Joystick;
