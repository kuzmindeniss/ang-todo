export interface ProjectType {
    name: string;
    color?: Colors;
};

export enum Colors {
    BerryRed = "rgb(184, 37, 95)",
    Red = "rgb(219, 64, 53)",
    Orange = "rgb(255, 153, 51)",
    Yellow =  "rgb(250, 208, 0)",
    OliveGreen = "rgb(175, 184, 59)",
    LimeGreen = "rgb(126, 204, 73)",
    Green = "rgb(41, 148, 56)",
    MintGreen = "rgb(106, 204, 188)",
    Teal = "rgb(21, 143, 173)",
    SkyBlue = "rgb(20, 170, 245)",
    LightBlue = "rgb(150, 195, 235)",
    Blue = "rgb(64, 115, 255)",
    Grape = "rgb(136, 77, 255)",
    Violet = "rgb(175, 56, 235)",
    Lavender = "rgb(235, 150, 235)",
    Magenta = "rgb(244, 81, 148)",
    Salmon = "rgb(255, 141, 133)",
    Charocal = "rgb(128, 128, 128)",
    Grey = "rgb(184, 184, 184)",
    Taupe = "rgb(204, 172, 147)"
}

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
}

export interface ProjectInterface {
    name: string;
    color?: keyof typeof Colors;
}