// Hero 3D Qalam Rupa: manuk & dahan dari logo SVG (hanya path kuning #FFC101).
// Dimuat lewat dynamic import dari HeroManuk.astro setelah halaman siap.
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import svgTeks from '../assets/favicon-qalam-rupa-180.svg?raw';

const KUNING = 'ffc101';
const MIRING_MAKS_Y = 0.55; // rad, kiri-kanan
const MIRING_MAKS_X = 0.35; // rad, atas-bawah

const batas = (v: number, min = -1, max = 1) => Math.min(max, Math.max(min, v));

function buatModelManuk(): THREE.Group {
	const data = new SVGLoader().parse(svgTeks);
	const shapes: THREE.Shape[] = [];

	for (const path of data.paths) {
		const fill = String(path.userData?.style?.fill ?? '').replace('#', '').toLowerCase();
		const warna = path.color?.getHexString?.() ?? '';
		// Hanya path kuning; kotak gelap logo (#231F20) dan clip-path dilewati.
		if (fill !== KUNING && warna !== KUNING) continue;
		shapes.push(...SVGLoader.createShapes(path));
	}

	const geometri = new THREE.ExtrudeGeometry(shapes, {
		depth: 7,
		bevelEnabled: true,
		bevelThickness: 1.6,
		bevelSize: 0.5,
		bevelSegments: 3,
		curveSegments: 10,
	});
	geometri.center();
	// Koordinat SVG: sumbu Y ke bawah → dibalik.
	geometri.scale(1, -1, 1);
	geometri.computeVertexNormals();

	const bahan = new THREE.MeshStandardMaterial({
		color: 0xffc101,
		metalness: 0.55,
		roughness: 0.32,
		side: THREE.DoubleSide,
	});

	const mesh = new THREE.Mesh(geometri, bahan);
	const grup = new THREE.Group();
	grup.add(mesh);

	// Skala: tinggi model ±3 unit.
	const kotak = new THREE.Box3().setFromObject(mesh);
	const ukuran = kotak.getSize(new THREE.Vector3());
	grup.scale.setScalar(3 / Math.max(ukuran.x, ukuran.y));
	return grup;
}

function buatGeometriDaun(): THREE.ShapeGeometry {
	const s = new THREE.Shape();
	s.moveTo(0, -0.5);
	s.quadraticCurveTo(0.32, 0, 0, 0.5);
	s.quadraticCurveTo(-0.32, 0, 0, -0.5);
	return new THREE.ShapeGeometry(s, 8);
}

type Daun = {
	mesh: THREE.Mesh;
	laju: number;
	ayun: number;
	fase: number;
	putar: THREE.Vector3;
};

export function init(root: HTMLElement) {
	const wadah = root.querySelector<HTMLElement>('.hero-kanvas');
	if (!wadah) return;

	let renderer: THREE.WebGLRenderer;
	try {
		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
	} catch {
		return; // WebGL gagal → logo statis tetap tampil
	}
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.05;
	wadah.appendChild(renderer.domElement);

	const scene = new THREE.Scene();
	const kamera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

	// Lampu lembut: lingkungan ruangan (untuk pantulan metalik) + hemisphere + satu cahaya kunci.
	const pmrem = new THREE.PMREMGenerator(renderer);
	scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
	scene.environmentIntensity = 0.55;
	pmrem.dispose();
	scene.add(new THREE.HemisphereLight(0xf6f1e7, 0x1b2a3a, 0.9));
	const kunci = new THREE.DirectionalLight(0xfff2d6, 1.4);
	kunci.position.set(2.5, 3, 4);
	scene.add(kunci);
	const pinggir = new THREE.DirectionalLight(0xa4502f, 0.6);
	pinggir.position.set(-3, -1, -2);
	scene.add(pinggir);

	const manuk = buatModelManuk();
	const poros = new THREE.Group(); // dimiringkan oleh interaksi
	poros.add(manuk);
	scene.add(poros);

	// Daun kecil berjatuhan
	const layarKecil = window.matchMedia('(max-width: 819px)').matches;
	const jumlahDaun = layarKecil ? 6 : 10;
	const geoDaun = buatGeometriDaun();
	const bahanDaun = [
		new THREE.MeshStandardMaterial({ color: 0xffc101, roughness: 0.6, metalness: 0.2, side: THREE.DoubleSide }),
		new THREE.MeshStandardMaterial({ color: 0xa4502f, roughness: 0.7, metalness: 0.1, side: THREE.DoubleSide }),
	];
	const daun: Daun[] = [];
	const ATAS = 2.6;
	const BAWAH = -2.6;
	for (let i = 0; i < jumlahDaun; i++) {
		const m = new THREE.Mesh(geoDaun, bahanDaun[i % 3 === 0 ? 1 : 0]);
		m.scale.setScalar(0.12 + Math.random() * 0.08);
		m.position.set((Math.random() - 0.5) * 4.4, BAWAH + Math.random() * (ATAS - BAWAH), -0.6 + Math.random() * 1.4);
		m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
		scene.add(m);
		daun.push({
			mesh: m,
			laju: 0.12 + Math.random() * 0.14,
			ayun: 0.15 + Math.random() * 0.25,
			fase: Math.random() * Math.PI * 2,
			putar: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(1.4),
		});
	}

	// ---------- Ukuran ----------
	function ubahUkuran() {
		const w = wadah!.clientWidth || 1;
		const h = wadah!.clientHeight || 1;
		renderer.setSize(w, h, false);
		kamera.aspect = w / h;
		// Jarak kamera agar model (±3.4 unit termasuk dahan) muat penuh.
		const isi = 3.6;
		const tanSetengah = Math.tan(THREE.MathUtils.degToRad(kamera.fov / 2));
		const jarakTinggi = isi / 2 / tanSetengah;
		const jarakLebar = isi / 2 / (tanSetengah * kamera.aspect);
		kamera.position.set(0, 0, Math.max(jarakTinggi, jarakLebar));
		kamera.lookAt(0, 0, 0);
		kamera.updateProjectionMatrix();
	}
	new ResizeObserver(ubahUkuran).observe(wadah);
	ubahUkuran();

	// ---------- Interaksi ----------
	const target = { x: 0, y: 0 };
	const sekarang = { x: 0, y: 0 };
	const pakaiMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

	if (pakaiMouse) {
		// Desktop: miring mengikuti posisi mouse relatif ke tengah hero.
		window.addEventListener(
			'pointermove',
			(e) => {
				if (e.pointerType !== 'mouse') return;
				const r = root.getBoundingClientRect();
				const nx = batas(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 1);
				const ny = batas(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 1);
				target.y = nx * MIRING_MAKS_Y;
				target.x = ny * MIRING_MAKS_X;
			},
			{ passive: true },
		);
		root.addEventListener('pointerleave', () => {
			target.x = 0;
			target.y = 0;
		});
	} else {
		// HP: giroskop (jika ada) + seret horizontal di kanvas.
		let adaGiro = false;
		let sedangSeret = false;
		let awalX = 0;
		let awalY = 0;

		const onOrientasi = (e: DeviceOrientationEvent) => {
			if (e.gamma == null || e.beta == null || sedangSeret) return;
			adaGiro = true;
			target.y = batas(e.gamma / 30) * MIRING_MAKS_Y;
			target.x = batas((e.beta - 45) / 30) * MIRING_MAKS_X;
		};

		const DOE = window.DeviceOrientationEvent as unknown as {
			requestPermission?: () => Promise<'granted' | 'denied'>;
		};
		if (typeof DOE?.requestPermission === 'function') {
			// iOS: izin giroskop hanya bisa diminta lewat sentuhan pengguna.
			wadah.addEventListener(
				'pointerdown',
				() => {
					DOE.requestPermission!()
						.then((s) => s === 'granted' && window.addEventListener('deviceorientation', onOrientasi))
						.catch(() => {});
				},
				{ once: true },
			);
		} else if ('DeviceOrientationEvent' in window) {
			window.addEventListener('deviceorientation', onOrientasi);
		}

		wadah.addEventListener('pointerdown', (e) => {
			sedangSeret = true;
			awalX = e.clientX;
			awalY = e.clientY;
		});
		wadah.addEventListener(
			'pointermove',
			(e) => {
				if (!sedangSeret) return;
				const lebar = wadah.clientWidth || 1;
				target.y = batas((e.clientX - awalX) / (lebar / 2)) * MIRING_MAKS_Y;
				target.x = batas((e.clientY - awalY) / (lebar / 2)) * MIRING_MAKS_X;
			},
			{ passive: true },
		);
		const lepas = () => {
			sedangSeret = false;
			if (!adaGiro) {
				target.x = 0;
				target.y = 0;
			}
		};
		wadah.addEventListener('pointerup', lepas);
		wadah.addEventListener('pointercancel', lepas);
	}

	// ---------- Animasi ----------
	const jam = new THREE.Clock();
	let waktu = 0;

	function bingkai() {
		const dt = Math.min(jam.getDelta(), 0.05);
		waktu += dt;

		// Miring halus menuju target
		const k = 1 - Math.pow(0.001, dt);
		sekarang.x += (target.x - sekarang.x) * k;
		sekarang.y += (target.y - sekarang.y) * k;
		poros.rotation.x = sekarang.x;
		poros.rotation.y = sekarang.y;

		// Gerak napas kecil
		const napas = Math.sin(waktu * 1.3);
		manuk.position.y = napas * 0.05;
		manuk.rotation.z = Math.sin(waktu * 0.7) * 0.015;
		const s = 1 + napas * 0.008;
		poros.scale.set(s, s, s);

		// Daun turun pelan sambil berayun dan berputar
		for (const d of daun) {
			const p = d.mesh.position;
			p.y -= d.laju * dt;
			p.x += Math.sin(waktu * 0.9 + d.fase) * d.ayun * dt;
			d.mesh.rotation.x += d.putar.x * dt;
			d.mesh.rotation.y += d.putar.y * dt;
			d.mesh.rotation.z += d.putar.z * dt;
			if (p.y < BAWAH) {
				p.y = ATAS;
				p.x = (Math.random() - 0.5) * 4.4;
			}
		}

		renderer.render(scene, kamera);
	}

	// Render hanya saat tab terlihat DAN hero ada di layar.
	let tabTerlihat = document.visibilityState === 'visible';
	let heroTerlihat = true;
	function aturLoop() {
		if (tabTerlihat && heroTerlihat) {
			jam.getDelta(); // buang selisih waktu selama jeda
			renderer.setAnimationLoop(bingkai);
		} else {
			renderer.setAnimationLoop(null);
		}
	}
	document.addEventListener('visibilitychange', () => {
		tabTerlihat = document.visibilityState === 'visible';
		aturLoop();
	});
	new IntersectionObserver((entri) => {
		heroTerlihat = entri[0]?.isIntersecting ?? true;
		aturLoop();
	}).observe(root);

	// Konteks WebGL hilang → kembali ke logo statis.
	renderer.domElement.addEventListener('webglcontextlost', (e) => {
		e.preventDefault();
		renderer.setAnimationLoop(null);
		root.classList.remove('hero-3d-siap');
	});

	bingkai();
	aturLoop();
	root.classList.add('hero-3d-siap');
}
