/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 * @author njbrown /  https://twitter.com/njbrown
 */

import { Geometry } from "three";
import { BufferGeometry } from "three";
import { Float32BufferAttribute } from "three";
import { Vector3 } from "three";
import { Vector2 } from "three";

// PlaneGeometry (X, Z)

class PlaneGeometry extends Geometry {
	parameters = {};

	constructor(width, height, widthSegments, heightSegments) {
		super();
		this.type = "PlaneGeometry";

		this.parameters = {
			width: width,
			height: height,
			widthSegments: widthSegments,
			heightSegments: heightSegments
		};

		this.fromBufferGeometry(
			new PlaneBufferGeometry(width, height, widthSegments, heightSegments)
		);
		this.mergeVertices();
	}
}

// PlaneBufferGeometry

class PlaneBufferGeometry extends BufferGeometry {
	parameters = {};

	constructor(width, height, widthSegments, heightSegments) {
		super();

		this.type = "PlaneBufferGeometry";

		this.parameters = {
			width: width,
			height: height,
			widthSegments: widthSegments,
			heightSegments: heightSegments
		};

		width = width || 1;
		height = height || 1;

		const width_half = width / 2;
		const height_half = height / 2;

		const gridX = Math.floor(widthSegments) || 1;
		const gridY = Math.floor(heightSegments) || 1;

		const gridX1 = gridX + 1;
		const gridY1 = gridY + 1;

		const segment_width = width / gridX;
		const segment_height = height / gridY;

		// buffers

		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		// generate vertices, normals and uvs

		for (let iy = 0; iy < gridY1; iy++) {
			const y = iy * segment_height - height_half;

			for (let ix = 0; ix < gridX1; ix++) {
				const x = ix * segment_width - width_half;

				vertices.push(x, 0, y);

				normals.push(0, 1, 0);

				uvs.push(ix / gridX);
				uvs.push(1 - iy / gridY);
			}
		}

		// indices

		for (let iy = 0; iy < gridY; iy++) {
			for (let ix = 0; ix < gridX; ix++) {
				const a = ix + gridX1 * iy;
				const b = ix + gridX1 * (iy + 1);
				const c = ix + 1 + gridX1 * (iy + 1);
				const d = ix + 1 + gridX1 * iy;

				// faces

				indices.push(a, b, d);
				indices.push(b, c, d);
			}
		}

		// build geometry

		this.setIndex(indices);
		this.setAttribute("position", new Float32BufferAttribute(vertices, 3));
		this.setAttribute("normal", new Float32BufferAttribute(normals, 3));
		this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
	}
}

export { PlaneGeometry, PlaneBufferGeometry };
