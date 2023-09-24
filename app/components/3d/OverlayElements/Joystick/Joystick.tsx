import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import JoystickInstance from "./JoystickInstance";

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

const Joystick = (): React.JSX.Element => {
  const joystickContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!joystickContainerRef.current) return;

    let joystick: JoystickInstance;
    if (typeof window !== 'undefined') {
      import('nipplejs').then((nipplejs) => {
        const manager = nipplejs.create({
          zone: joystickContainerRef.current!,
          mode: 'static',
          position: { left: '50%', top: '50%' },
        });
        joystick = new JoystickInstance(manager, joystickContainerRef.current!);
      })
    }
    return () => joystick?.manager.destroy();
  }, []);

  return <JoystickContainer ref={joystickContainerRef} />;
};

export default Joystick;
