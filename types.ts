export interface CarouselItem {
  id: string;
  url: string;
  title: string;
  isGenerated: boolean;
  width: number;
  height: number;
}

export interface GeneratedImageResponse {
  base64: string;
  mimeType: string;
}

export interface LightboxState {
  isOpen: boolean;
  activeItem: CarouselItem | null;
  initialBounds: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
}