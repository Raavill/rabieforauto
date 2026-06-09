import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float u_time;
uniform vec2 u_res;
uniform float u_speed;
uniform vec2 u_flarePos;
uniform float u_starOpacity;
uniform vec2 u_mouse;

#define PI 3.14159265359
#define NUM_STAR_LAYERS 3

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hash1(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.1;
    a *= 0.5;
  }
  return v;
}

vec3 starfield(vec2 uv, float t, float speed, float opacity) {
  vec3 col = vec3(0.0);
  float brightnessScale = 1.0 / sqrt(float(NUM_STAR_LAYERS));

  for (int i = 0; i < NUM_STAR_LAYERS; i++) {
    float fi = float(i);
    float layerSpeed = speed * (0.15 + fi * 0.08);
    float warpT = t * layerSpeed;
    float z = fract(fi / float(NUM_STAR_LAYERS) + warpT);
    float depthScale = mix(3.0, 0.3, z);
    float zoomMix = smoothstep(0.0, 0.3, z) * smoothstep(1.0, 0.7, z);
    float zoomScale = mix(0.5, 2.5, zoomMix);
    vec2 dir = uv;
    vec2 moveOffset = vec2(t * layerSpeed * 0.04, sin(t * layerSpeed * 0.03) * 0.03);
    vec2 starUV = (dir + moveOffset + vec2(fi * 50.0)) * depthScale * zoomScale;
    vec2 grid = fract(starUV) - 0.5;
    vec2 id = floor(starUV);
    float rand = hash(id + fi * 100.0);
    if (rand > 0.7) continue;
    float d = length(grid);
    float starSize = 0.02 + rand * 0.03;
    float twinkle = sin(t * (2.0 + rand * 3.0) + rand * 100.0) * 0.3 + 0.7;
    float baseBright = smoothstep(starSize, 0.0, d) * twinkle;
    float hueShift = rand * 0.15;
    vec3 coreColor = vec3(1.0, 0.97 - hueShift * 0.3, 0.95 - hueShift * 0.5);
    col += baseBright * coreColor * brightnessScale * opacity;
  }
  return col;
}

float vignette(vec2 uv) {
  return smoothstep(1.0, 0.3, length(uv));
}

vec3 anamorphicFlare(vec2 uv, vec2 flarePos, float intensity) {
  vec2 delta = uv - flarePos;
  float stretch = 12.0;
  vec2 aspectStretch = vec2(1.0, stretch);
  float dist = length(delta * aspectStretch);
  float core = exp(-dist * dist * 2.0);
  float horizontalLine = exp(-abs(delta.y) * 60.0) * exp(-abs(delta.x) * 3.0);
  float flare = core * 0.3 + horizontalLine * 0.15;
  float h2 = exp(-abs(delta.y) * 20.0) * exp(-abs(delta.x) * 1.5);
  flare += h2 * 0.08;
  float r = flare * 1.0;
  float g = flare * 0.9;
  float b = flare * 0.75;
  vec3 flareCol = vec3(r, g, b);
  float angle = atan(delta.y, delta.x);
  float rainbow = sin(angle * 3.0 + 2.0) * 0.5 + 0.5;
  vec3 rainbowCol = vec3(rainbow, rainbow * 0.8 + 0.2, 1.0 - rainbow * 0.5) * horizontalLine * 0.1;
  return (flareCol + rainbowCol) * intensity;
}

vec3 chromaticEdges(vec2 uv, float t) {
  float aberration = 0.03 * (length(uv) * 0.5);
  vec2 caOffset = aberration * vec2(sin(t * 0.7), cos(t * 0.5)) * 0.3;
  return vec3(
    fbm(uv * 2.0 + caOffset + t * 0.05),
    fbm(uv * 2.0 + t * 0.05),
    fbm(uv * 2.0 - caOffset + t * 0.05)
  ) * 0.015;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);
  float t = u_time;
  vec3 col = starfield(uv, t, u_speed, u_starOpacity);
  col += chromaticEdges(uv, t);
  float scanY = uv.y * 30.0 + t * u_speed * 0.5;
  float scanline = sin(scanY) * 0.5 + 0.5;
  col += scanline * 0.015;
  float edgeShift = length(uv) * 0.02;
  col += vec3(edgeShift * 0.2, edgeShift * 0.1, 0.0);
  col *= vignette(uv);
  vec2 flareUV = (u_flarePos - u_res * 0.5) / min(u_res.x, u_res.y);
  if (u_mouse.x > 0.0) {
    col += anamorphicFlare(uv, flareUV, 1.0);
  }
  vec2 autoFlarePos = vec2(sin(t * 0.2) * 0.4, cos(t * 0.15) * 0.3);
  col += anamorphicFlare(uv, autoFlarePos, 0.5);
  col = col / (1.0 + col * 0.2);
  gl_FragColor = vec4(pow(col, vec3(0.95, 0.98, 1.02)), 1.0);
}
`;

export default function CinematicSpeedField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geo = new THREE.BufferGeometry();
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 2));

    const uniforms = {
      u_time: { value: 0.0 },
      u_res: { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) },
      u_speed: { value: 1.0 },
      u_flarePos: { value: new THREE.Vector2(canvas.clientWidth * 0.5, canvas.clientHeight * 0.5) },
      u_starOpacity: { value: 0.8 },
      u_mouse: { value: new THREE.Vector2(-1, -1) },
    };

    const mat = new THREE.RawShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h);
      uniforms.u_res.value.set(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = rect.height - (e.clientY - rect.top);
    };
    const handleMouseLeave = () => {
      mouseRef.current.x = -1;
      mouseRef.current.y = -1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      uniforms.u_time.value = performance.now() * 0.001;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      uniforms.u_mouse.value.set(mx, my);

      if (mx > 0) {
        uniforms.u_flarePos.value.set(mx, my);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
