export { };

declare global {
    type PictureSide =
        | "front"
        | "leftFront"
        | "rightFront"
        | "leftBack"
        | "rightBack";

    interface PictureInterface {
        front: Picture | null;
        leftFront: Picture | null;
        rightFront: Picture | null;
        leftBack: Picture | null;
        rightBack: Picture | null;
    }

    type Gender = "male" | "female";

    interface GenderParts {
        eyeL: Array<string>;
        eyeR: Array<string>;
        bottom: Array<string>;
        body: Array<string>;
        hair: Array<string>;
        head: Array<string>;
        shoes: Array<string>;
        top: Array<string>;
    }

    interface IButton {
        children: React.ReactNode;
        [x: string]: any;
    }

    type BodyParts = "gender" | "hair" | "top" | "bottom" | "shoes";

    interface AdlerPostProps {
        author: string;
        content: React.ReactNode;
    }
    interface AdlerFeedProps {
        posts: AdlerPostProps[];
    }
}
