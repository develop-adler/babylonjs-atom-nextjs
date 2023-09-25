export { };

declare global {
    type AtomType = "classic" | "modern";
    type PictureSide =
        | "front"
        | "leftFront"
        | "rightFront"
        | "leftBack"
        | "rightBack";
    type Gender = "male" | "female";
    type BodyParts = "gender" | "hair" | "top" | "bottom" | "shoes";

    interface PictureInterface {
        front: Picture | null;
        leftFront: Picture | null;
        rightFront: Picture | null;
        leftBack: Picture | null;
        rightBack: Picture | null;
    }

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

    interface AdlerPostProps {
        author: string;
        content: React.ReactNode;
    }
    interface AdlerFeedProps {
        posts: AdlerPostProps[];
    }
}
