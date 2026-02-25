// 'use client';

// import {
//   Camera,
//   Mesh,
//   Plane,
//   Program,
//   Renderer,
//   Texture,
//   Transform,
// } from 'ogl';
// import { useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';

// // --- Utilities ---
// function lerp(p1: number, p2: number, t: number): number {
//   return p1 + (p2 - p1) * t;
// }

// function autoBind(instance: any): void {
//   const proto = Object.getPrototypeOf(instance);
//   Object.getOwnPropertyNames(proto).forEach((key) => {
//     if (key !== 'constructor' && typeof instance[key] === 'function') {
//       instance[key] = instance[key].bind(instance);
//     }
//   });
// }

// // --- Text Texture Logic ---
// function createTextTexture(
//   gl: any,
//   text: string,
//   font: string = 'bold 30px sans-serif',
//   color: string = 'black',
// ): { texture: Texture; width: number; height: number } {
//   const canvas = document.createElement('canvas');
//   const context = canvas.getContext('2d');
//   if (!context) throw new Error('Could not get 2d context');

//   context.font = font;
//   const metrics = context.measureText(text);
//   const textWidth = Math.ceil(metrics.width);
//   const fontSize = parseInt(font.match(/(\d+)px/)?.[1] || '30', 10);
//   const textHeight = Math.ceil(fontSize * 1.2);

//   canvas.width = textWidth + 20;
//   canvas.height = textHeight + 20;

//   context.font = font;
//   context.fillStyle = color;
//   context.textBaseline = 'middle';
//   context.textAlign = 'center';
//   context.clearRect(0, 0, canvas.width, canvas.height);
//   context.fillText(text, canvas.width / 2, canvas.height / 2);

//   const texture = new Texture(gl, { generateMipmaps: false });
//   texture.image = canvas;
//   return { texture, width: canvas.width, height: canvas.height };
// }

// // --- Title Class ---
// class Title {
//   gl: any;
//   plane: Mesh;
//   renderer: Renderer;
//   text: string;
//   textColor: string;
//   font: string;
//   mesh!: Mesh;

//   constructor({
//     gl,
//     plane,
//     renderer,
//     text,
//     textColor = '#545050',
//     font = '30px sans-serif',
//   }: any) {
//     autoBind(this);
//     this.gl = gl;
//     this.plane = plane;
//     this.renderer = renderer;
//     this.text = text;
//     this.textColor = textColor;
//     this.font = font;
//     this.createMesh();
//   }

//   createMesh() {
//     const { texture, width, height } = createTextTexture(
//       this.gl,
//       this.text,
//       this.font,
//       this.textColor,
//     );
//     const geometry = new Plane(this.gl);
//     const program = new Program(this.gl, {
//       vertex: `attribute vec3 position; attribute vec2 uv; uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix; varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
//       fragment: `precision highp float; uniform sampler2D tMap; varying vec2 vUv; void main() { vec4 color = texture2D(tMap, vUv); if (color.a < 0.1) discard; gl_FragColor = color; }`,
//       uniforms: { tMap: { value: texture } },
//       transparent: true,
//     });
//     this.mesh = new Mesh(this.gl, { geometry, program });
//     const aspect = width / height;
//     const textHeightScaled = this.plane.scale.y * 0.15;
//     this.mesh.scale.set(textHeightScaled * aspect, textHeightScaled, 1);
//     this.mesh.position.y =
//       -this.plane.scale.y * 0.5 - textHeightScaled * 0.5 - 0.05;
//     this.mesh.setParent(this.plane);
//   }
// }

// // --- Media Class ---
// class Media {
//   [key: string]: any;
//   constructor({
//     geometry,
//     gl,
//     image,
//     index,
//     length,
//     renderer,
//     scene,
//     screen,
//     text,
//     viewport,
//     bend,
//     textColor,
//     borderRadius = 0,
//     font,
//     id,
//   }: any) {
//     Object.assign(this, {
//       geometry,
//       gl,
//       image,
//       index,
//       length,
//       renderer,
//       scene,
//       screen,
//       text,
//       viewport,
//       bend,
//       textColor,
//       borderRadius,
//       font,
//       id,
//       extra: 0,
//       speed: 0,
//     });
//     this.createShader();
//     this.createMesh();
//     this.createTitle();
//     this.onResize();
//   }

//   createShader() {
//     const texture = new Texture(this.gl, { generateMipmaps: true });
//     this.program = new Program(this.gl, {
//       depthTest: false,
//       depthWrite: false,
//       vertex: `precision highp float; attribute vec3 position; attribute vec2 uv; uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix; uniform float uTime; uniform float uSpeed; varying vec2 vUv; void main() { vUv = uv; vec3 p = position; p.z = 0.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
//       fragment: `precision highp float; uniform vec2 uImageSizes; uniform vec2 uPlaneSizes; uniform sampler2D tMap; uniform float uBorderRadius; varying vec2 vUv; float roundedBoxSDF(vec2 p, vec2 b, float r) { vec2 d = abs(p) - b; return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r; } void main() { vec2 ratio = vec2(min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0), min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)); vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5); vec4 color = texture2D(tMap, uv); float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius); float alpha = 1.0 - smoothstep(-0.002, 0.002, d); gl_FragColor = vec4(color.rgb, alpha); }`,
//       uniforms: {
//         tMap: { value: texture },
//         uPlaneSizes: { value: [0, 0] },
//         uImageSizes: { value: [0, 0] },
//         uSpeed: { value: 0 },
//         uTime: { value: 100 * Math.random() },
//         uBorderRadius: { value: this.borderRadius },
//       },
//       transparent: true,
//     });

//     const img = new Image();
//     img.crossOrigin = 'anonymous';
//     img.src = this.image;
//     img.onload = () => {
//       texture.image = img;
//       this.program.uniforms.uImageSizes.value = [
//         img.naturalWidth,
//         img.naturalHeight,
//       ];
//     };
//   }

//   createMesh() {
//     this.plane = new Mesh(this.gl, {
//       geometry: this.geometry,
//       program: this.program,
//     });
//     this.plane.setParent(this.scene);
//   }

//   createTitle() {
//     this.title = new Title({
//       gl: this.gl,
//       plane: this.plane,
//       renderer: this.renderer,
//       text: this.text,
//       textColor: this.textColor,
//       font: this.font,
//     });
//   }

//   update(scroll: any, direction: string) {
//     this.plane.position.x = this.x - scroll.current - this.extra;
//     const x = this.plane.position.x;
//     const H = this.viewport.width / 2;
//     if (this.bend !== 0) {
//       const B_abs = Math.abs(this.bend);
//       const R = (H * H + B_abs * B_abs) / (2 * B_abs);
//       const effectiveX = Math.min(Math.abs(x), H);
//       const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
//       this.plane.position.y = this.bend > 0 ? -arc : arc;
//       this.plane.rotation.z =
//         (this.bend > 0 ? -1 : 1) * Math.sign(x) * Math.asin(effectiveX / R);
//     }
//     this.program.uniforms.uTime.value += 0.04;
//     this.program.uniforms.uSpeed.value = scroll.current - scroll.last;

//     const planeOffset = this.plane.scale.x / 2;
//     const viewportOffset = this.viewport.width / 2;
//     if (
//       direction === 'right' &&
//       this.plane.position.x + planeOffset < -viewportOffset
//     )
//       this.extra -= this.widthTotal;
//     if (
//       direction === 'left' &&
//       this.plane.position.x - planeOffset > viewportOffset
//     )
//       this.extra += this.widthTotal;
//   }

//   onResize({ screen, viewport }: any = {}) {
//     if (screen) this.screen = screen;
//     if (viewport) this.viewport = viewport;

//     this.scale = this.screen.height / 1500;
//     this.plane.scale.y =
//       (this.viewport.height * (900 * this.scale)) / this.screen.height;
//     this.plane.scale.x =
//       (this.viewport.width * (700 * this.scale)) / this.screen.width;

//     this.plane.program.uniforms.uPlaneSizes.value = [
//       this.plane.scale.x,
//       this.plane.scale.y,
//     ];

//     this.widthTotal = (this.plane.scale.x + 2) * this.length;
//     this.x = (this.plane.scale.x + 2) * this.index;
//   }
// }

// // --- App Class ---
// class App {
//   [key: string]: any;

//   constructor(container: HTMLElement, config: any) {
//     this.container = container;

//     this.scroll = { ease: config.scrollEase, current: 0, target: 0, last: 0 };
//     this.scrollSpeed = config.scrollSpeed;

//     this.createRenderer();
//     this.createCamera();
//     this.createScene();
//     this.onResize();
//     this.createGeometry();
//     this.createMedias(config);
//     this.addEventListeners();

//     this.onCardClick = config.onCardClick;
//     this.update();
//   }

//   createRenderer() {
//     this.renderer = new Renderer({
//       alpha: true,
//       antialias: true,
//       dpr: Math.min(window.devicePixelRatio, 2),
//     });
//     this.gl = this.renderer.gl;
//     this.container.appendChild(this.gl.canvas);
//   }

//   createCamera() {
//     this.camera = new Camera(this.gl);
//     this.camera.position.z = 20;
//   }

//   createScene() {
//     this.scene = new Transform();
//   }

//   createGeometry() {
//     this.planeGeometry = new Plane(this.gl, {
//       heightSegments: 50,
//       widthSegments: 100,
//     });
//   }

//   createMedias(config: any) {
//     const items = config.items || [];
//     this.medias = [...items, ...items].map(
//       (data, index) =>
//         new Media({
//           geometry: this.planeGeometry,
//           gl: this.gl,
//           image: data.image,
//           index,
//           length: items.length * 2,
//           renderer: this.renderer,
//           scene: this.scene,
//           screen: this.screen,
//           text: data.text,
//           viewport: this.viewport,
//           bend: config.bend,
//           textColor: config.textColor,
//           borderRadius: config.borderRadius,
//           font: config.font,
//           id: data.id,
//         }),
//     );
//   }

//   checkHover(x: number, y: number) {
//     const vx = x * (this.viewport.width / 2);
//     const vy = y * (this.viewport.height / 2);
//     for (const media of this.medias) {
//       const mx = media.plane.position.x;
//       const my = media.plane.position.y;
//       const w = media.plane.scale.x / 2;
//       const h = media.plane.scale.y / 2;
//       if (vx >= mx - w && vx <= mx + w && vy >= my - h && vy <= my + h)
//         return media;
//     }
//     return null;
//   }

//   addEventListeners() {
//     window.addEventListener('resize', this.onResize.bind(this));

//     // Scroll
//     let lastScrollY = window.scrollY;
//     this.handleScroll = () => {
//       const delta = window.scrollY - lastScrollY;
//       this.scroll.target += delta * 0.1 * this.scrollSpeed;
//       lastScrollY = window.scrollY;
//     };
//     window.addEventListener('scroll', this.handleScroll);

//     // Drag
//     let isDown = false;
//     let startX = 0;
//     let startTarget = 0;

//     const down = (e: any) => {
//       isDown = true;
//       this.container.style.cursor = 'grabbing';
//       startX = e.touches ? e.touches[0].clientX : e.clientX;
//       startTarget = this.scroll.target;
//     };
//     const move = (e: any) => {
//       if (!isDown) return;
//       const x = e.touches ? e.touches[0].clientX : e.clientX;
//       this.scroll.target = startTarget + (startX - x) * 0.05;
//     };
//     const up = () => {
//       isDown = false;
//       this.container.style.cursor = 'grab';
//     };

//     this.container.addEventListener('mousedown', down);
//     this.container.addEventListener('mousemove', move);
//     window.addEventListener('mouseup', up);
//     this.container.addEventListener('touchstart', down);
//     this.container.addEventListener('touchmove', move);
//     window.addEventListener('touchend', up);

//     // Hover & Click
//     this.container.addEventListener('mousemove', (e: any) => {
//       const rect = this.gl.canvas.getBoundingClientRect();
//       const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
//       const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
//       const hovered = this.checkHover(x, y);
//       this.container.style.cursor = hovered
//         ? 'pointer'
//         : isDown
//           ? 'grabbing'
//           : 'grab';
//     });

//     this.container.addEventListener('click', (e: any) => {
//       const rect = this.gl.canvas.getBoundingClientRect();
//       const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
//       const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
//       const clicked = this.checkHover(x, y);
//       if (clicked && this.onCardClick) this.onCardClick(clicked.id);
//     });
//   }

//   update() {
//     this.scroll.current = lerp(
//       this.scroll.current,
//       this.scroll.target,
//       this.scroll.ease,
//     );
//     const dir = this.scroll.current > this.scroll.last ? 'right' : 'left';
//     this.medias?.forEach((m: any) => m.update(this.scroll, dir));
//     this.renderer.render({ scene: this.scene, camera: this.camera });
//     this.scroll.last = this.scroll.current;
//     this.raf = window.requestAnimationFrame(this.update.bind(this));
//   }

//   onResize() {
//     this.screen = {
//       width: this.container.clientWidth,
//       height: this.container.clientHeight,
//     };
//     this.renderer.setSize(this.screen.width, this.screen.height);
//     this.camera.perspective({ aspect: this.screen.width / this.screen.height });
//     const fov = (this.camera.fov * Math.PI) / 180;
//     const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
//     this.viewport = { width: height * this.camera.aspect, height };
//     this.medias?.forEach((m: any) =>
//       m.onResize({ screen: this.screen, viewport: this.viewport }),
//     );
//   }

//   destroy() {
//     window.cancelAnimationFrame(this.raf);
//     window.removeEventListener('scroll', this.handleScroll);
//     this.gl.canvas.remove();
//   }
// }

// // --- React Wrapper ---
// export const CircularGallery = ({
//   items,
//   bend = 3,
//   textColor = '#ffffff',
//   borderRadius = 0.05,
//   font = 'bold 30px Figtree',
//   scrollSpeed = 2,
//   scrollEase = 0.05,
//   onCardClick,
// }: any) => {
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!ref.current) return;
//     const app = new App(ref.current, {
//       items,
//       bend,
//       textColor,
//       borderRadius,
//       font,
//       scrollSpeed,
//       scrollEase,
//       onCardClick,
//     });
//     requestAnimationFrame(() => app.update());
//     return () => app.destroy();
//   }, [
//     items,
//     bend,
//     textColor,
//     borderRadius,
//     font,
//     scrollSpeed,
//     scrollEase,
//     onCardClick,
//   ]);

//   return (
//     <div
//       className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
//       tabIndex={0}
//       ref={ref}
//     />
//   );
// };
