module spine {
    export class SkeletonBinary {
        attachmentLoader: AttachmentLoader
        scale = 1
        private linkedMeshes = new Array<LinkedMesh>()
        constructor(t: AttachmentLoader) {
            this.attachmentLoader = t
        }
        readSkeletonData(r: Uint8Array) {
            let n = this.scale;
            const a = new BinaryInput(r);
            const i = new SkeletonData();
            
            i.hash = a.readString()
            i.version = a.readString()
            i.width = a.readFloat()
            i.height = a.readFloat()
            let o = a.readBool()
            o && ((i.fps = a.readFloat()), (i.imagesPath = a.readString()))
            for (let s = 0, h = a.readVarInt(); s < h; s++) {
                let l = a.readString(),
                    u = null
                if (s > 0) {
                    let c = a.readVarInt()
                    if (((u = i.bones[c]), null == u))
                        throw new Error('Parent bone not found: ' + c)
                }
                let d = new BoneData(s, l, u)
                ;(d.rotation = a.readFloat()),
                    (d.x = a.readFloat() * n),
                    (d.y = a.readFloat() * n),
                    (d.scaleX = a.readFloat()),
                    (d.scaleY = a.readFloat()),
                    (d.shearX = a.readFloat()),
                    (d.shearY = a.readFloat()),
                    (d.length = a.readFloat() * n),
                    (d.transformMode = a.readByte()),
                    o && a.readColor(),
                    i.bones.push(d)
            }
            for (let s = 0, p = a.readVarInt(); s < p; s++) {
                let f = a.readString(),
                    v = a.readVarInt(),
                    M = i.bones[v]
                if (null == M) throw new Error('Slot bone not found: ' + v)
                let d = new SlotData(s, f, M),
                    g = a.readColor()
                null != g && d.color.set(g[0], g[1], g[2], g[3])
                let m = a.readColor()
                null != m &&
                    ((d.darkColor = new Color(1, 1, 1, 1)),
                    d.darkColor.set(m[0], m[1], m[2], m[3])),
                    (d.attachmentName = a.readString()),
                    (d.blendMode = a.readByte()),
                    i.slots.push(d)
            }
            for (let s = 0, y = a.readVarInt(); s < y; s++) {
                let d = new IkConstraintData(a.readString())
                d.order = a.readVarInt()
                for (let x = 0, h = a.readVarInt(); x < h; x++) {
                    let v = a.readVarInt(),
                        w = i.bones[v]
                    if (null == w) throw new Error('IK bone not found: ' + v)
                    d.bones.push(w)
                }
                let A = a.readVarInt()
                if (((d.target = i.bones[A]), null == d.target))
                    throw new Error('IK target bone not found: ' + A)
                ;(d.mix = a.readFloat()),
                    (d.bendDirection = a.readSByte()),
                    i.ikConstraints.push(d)
            }
            for (let s = 0, T = a.readVarInt(); s < T; s++) {
                let d = new TransformConstraintData(a.readString())
                d.order = a.readVarInt()
                for (let x = 0, h = a.readVarInt(); x < h; x++) {
                    let v = a.readVarInt(),
                        w = i.bones[v]
                    if (null == w)
                        throw new Error(
                            'Transform constraint bone not found: ' + v
                        )
                    d.bones.push(w)
                }
                let A = a.readVarInt()
                if (((d.target = i.bones[A]), null == d.target))
                    throw new Error(
                        'Transform constraint target bone not found: ' + A
                    )
                ;(d.local = a.readBool()),
                    (d.relative = a.readBool()),
                    (d.offsetRotation = a.readFloat()),
                    (d.offsetX = a.readFloat()),
                    (d.offsetY = a.readFloat()),
                    (d.offsetScaleX = a.readFloat()),
                    (d.offsetScaleY = a.readFloat()),
                    (d.offsetShearY = a.readFloat()),
                    (d.rotateMix = a.readFloat()),
                    (d.translateMix = a.readFloat()),
                    (d.scaleMix = a.readFloat()),
                    (d.shearMix = a.readFloat()),
                    i.transformConstraints.push(d)
            }
            for (let s = 0, E = a.readVarInt(); s < E; s++) {
                let d = new PathConstraintData(a.readString())
                d.order = a.readVarInt()
                for (let x = 0, h = a.readVarInt(); x < h; x++) {
                    let v = a.readVarInt(),
                        w = i.bones[v]
                    if (null == w)
                        throw new Error(
                            'Transform constraint bone not found: ' + v
                        )
                    d.bones.push(w)
                }
                let A = a.readVarInt()
                if (((d.target = i.slots[A]), null == d.target))
                    throw new Error('Path target slot not found: ' + A)
                ;(d.positionMode = a.readByte()),
                    (d.spacingMode = a.readByte()),
                    (d.rotateMode = a.readByte()),
                    (d.offsetRotation = a.readFloat()),
                    (d.position = a.readFloat()),
                    d.positionMode == PositionMode.Fixed && (d.position *= n),
                    (d.spacing = a.readFloat()),
                    (d.spacingMode != SpacingMode.Length &&
                        d.spacingMode != SpacingMode.Fixed) ||
                        (d.spacing *= n),
                    (d.rotateMix = a.readFloat()),
                    (d.translateMix = a.readFloat()),
                    i.pathConstraints.push(d)
            }
            let b = new Skin('default')
            for (let s = 0, p = a.readVarInt(); s < p; s++)
                for (
                    let C = a.readVarInt(), x = 0, R = a.readVarInt();
                    x < R;
                    x++
                ) {
                    let I = a.readString(),
                        S = this.readAttachment(a, b, C, I, i, o)
                    null != S && b.addAttachment(C, I, S)
                }
            i.skins.push(b), (i.defaultSkin = b)
            for (let s = 0, P = a.readVarInt(); s < P; s++) {
                let V = new Skin(a.readString())
                for (let x = 0, p = a.readVarInt(); x < p; x++)
                    for (
                        let C = a.readVarInt(), F = 0, R = a.readVarInt();
                        F < R;
                        F++
                    ) {
                        let I = a.readString(),
                            S = this.readAttachment(a, V, C, I, i, o)
                        null != S && V.addAttachment(C, I, S)
                    }
                i.skins.push(V)
            }
            for (let s = 0, L = this.linkedMeshes.length; s < L; s++) {
                let _ = this.linkedMeshes[s],
                    V = null == _.skin ? i.defaultSkin : i.findSkin(_.skin)
                if (null == V) throw new Error('Skin not found: ' + _.skin)
                let k = V.getAttachment(_.slotIndex, _.parent)
                if (null == k)
                    throw new Error('Parent mesh not found: ' + _.parent)
                _.mesh.setParentMesh(k as MeshAttachment), _.mesh.updateUVs()
            }
            this.linkedMeshes.length = 0
            for (let s = 0, N = a.readVarInt(); s < N; s++) {
                let d = new EventData(a.readString())
                ;(d.intValue = a.readVarInt(!1)),
                    (d.floatValue = a.readFloat()),
                    (d.stringValue = a.readString()),
                    i.events.push(d)
            }
            for (let s = 0, D = a.readVarInt(); s < D; s++) {
                let B = a.readString()
                this.readAnimation(a, B, i)
            }
            return i
        }
        readAttachment(
            e: BinaryInput,
            r: Skin,
            i: number,
            a: string,
            o: SkeletonData,
            s: boolean
        ) {
            let h = this.scale,
                l = e.readString()
            l || (l = a)
            let u = e.readByte()
            switch (u) {
                case AttachmentType.Region: {
                    let c = e.readString()
                    c || (c = l)
                    let d = this.attachmentLoader.newRegionAttachment(r, l, c)
                    if (null == d) return null
                    ;(d.path = c),
                        (d.rotation = e.readFloat()),
                        (d.x = e.readFloat() * h),
                        (d.y = e.readFloat() * h),
                        (d.scaleX = e.readFloat()),
                        (d.scaleY = e.readFloat()),
                        (d.width = e.readFloat() * h),
                        (d.height = e.readFloat() * h)
                    let p = e.readColor()
                    return (
                        null != p && d.color.set(p[0], p[1], p[2], p[3]),
                        d.updateOffset(),
                        d
                    )
                }

                case AttachmentType.BoundingBox: {
                    let f = this.attachmentLoader.newBoundingBoxAttachment(r, l)
                    if (null == f) return null
                    let v = e.readVarInt()
                    if ((this.readVertices(e, f, v), s)) {
                        let p = e.readColor()
                        null != p && f.color.set(p[0], p[1], p[2], p[3])
                    }
                    return f
                }

                case AttachmentType.Mesh: {
                    let c = e.readString()
                    c || (c = l)
                    let M = this.attachmentLoader.newMeshAttachment(r, l, c)
                    if (null == M) return null
                    M.path = c
                    let p = e.readColor()
                    null != p && M.color.set(p[0], p[1], p[2], p[3])
                    let g = []
                    for (let m = 0, y = e.readVarInt(); m < y; m++)
                        g.push(e.readFloat()), g.push(e.readFloat())
                    let x = []
                    for (let m = 0, w = e.readVarInt(); m < w; m++)
                        x.push(e.readShort())
                    if (
                        ((M.triangles = x),
                        (M.regionUVs = g),
                        this.readVertices(e, M, g.length / 2),
                        M.updateUVs(),
                        (M.hullLength = 2 * e.readVarInt()),
                        s)
                    ) {
                        for (let A = [], m = 0, T = e.readVarInt(); m < T; m++)
                            A.push(e.readShort())
                        e.readFloat(), e.readFloat()
                    }
                    return M
                }

                case AttachmentType.LinkedMesh: {
                    let c = e.readString()
                    c || (c = l)
                    let M = this.attachmentLoader.newMeshAttachment(r, l, c)
                    if (null == M) return null
                    M.path = c
                    let p = e.readColor()
                    null != p && M.color.set(p[0], p[1], p[2], p[3])
                    let E = e.readString(),
                        b = e.readString(),
                        C = e.readBool()
                    if (
                        ((M.inheritDeform = C),
                        this.linkedMeshes.push(new LinkedMesh(M, E, i, b)),
                        s)
                    ) {
                        e.readFloat(), e.readFloat()
                    }
                    return M
                }

                case AttachmentType.Path: {
                    let c = this.attachmentLoader.newPathAttachment(r, l)
                    if (null == c) return null
                    ;(c.closed = e.readBool()), (c.constantSpeed = e.readBool())
                    let v = e.readVarInt()
                    this.readVertices(e, c, v)
                    let R = Utils.newArray(v / 3, 0)
                    for (let m = 0; m < R.length; m++) R[m] = e.readFloat() * h
                    if (((c.lengths = R), s)) {
                        let p = e.readColor()
                        null != p && c.color.set(p[0], p[1], p[2], p[3])
                    }
                    return c
                }

                case AttachmentType.Point: {
                    let I = this.attachmentLoader.newPointAttachment(r, l)
                    if (null == I) return null
                    if (
                        ((I.x = e.readFloat() * h),
                        (I.y = e.readFloat() * h),
                        (I.rotation = e.readFloat()),
                        s)
                    ) {
                        let p = e.readColor()
                        null != p && I.color.set(p[0], p[1], p[2], p[3])
                    }
                    return I
                }

                case AttachmentType.Clipping: {
                    let S = this.attachmentLoader.newClippingAttachment(r, l)
                    if (null == S) return null
                    let P = e.readVarInt(),
                        V = o.slots[P]
                    if (null == V)
                        throw new Error('Clipping end slot not found: ' + P)
                    S.endSlot = V
                    let v = e.readVarInt()
                    if ((this.readVertices(e, S, v), s)) {
                        let p = e.readColor()
                        null != p && S.color.set(p[0], p[1], p[2], p[3])
                    }
                    return S
                }
            }
            return null
        }
        readVertices(e: BinaryInput, r: VertexAttachment, n: number): void {
            let i = this.scale
            r.worldVerticesLength = 2 * n
            let a = e.readBool()
            if (!a) {
                let o = new Array()
                for (let s = 0; s < n; s++)
                    o.push(e.readFloat()), o.push(e.readFloat())
                let h = Utils.toFloatArray(o)
                if (1 != i) for (let s = 0, l = o.length; s < l; s++) h[s] *= i
                return void (r.vertices = h)
            }
            let u = new Array()
            let c = new Array()
            for (let s = 0, l = n; s < l; s++) {
                let d = e.readVarInt()
                c.push(d)
                for (let p = 0; p < d; p++)
                    c.push(e.readVarInt()),
                        u.push(e.readFloat() * i),
                        u.push(e.readFloat() * i),
                        u.push(e.readFloat())
            }
            ;(r.bones = c), (r.vertices = Utils.toFloatArray(u))
        }
        readAnimation(e: BinaryInput, r: string, n: SkeletonData) {
            let i = this.scale
            let a = new Array()
            let o = 0
            let s = 0
            let h = e.readVarInt()
            for (; s < h; s++)
                for (
                    let l = e.readVarInt(), u = 0, c = e.readVarInt();
                    u < c;
                    u++
                ) {
                    let d = e.readByte() + 4,
                        p = e.readVarInt()
                    if (d == TimelineType.attachment) {
                        let f = new AttachmentTimeline(p)
                        f.slotIndex = l
                        for (let v = 0, M = 0; M < p; M++)
                            f.setFrame(v++, e.readFloat(), e.readString())
                        a.push(f),
                            (o = Math.max(o, f.frames[f.getFrameCount() - 1]))
                    } else if (d == TimelineType.color) {
                        let f = new ColorTimeline(p)
                        f.slotIndex = l
                        for (let v = 0, g = 0; g < p; g++) {
                            let m = e.readFloat(),
                                y = e.readColor()
                            y || (y = [1, 1, 1, 1]),
                                f.setFrame(v, m, y[0], y[1], y[2], y[3]),
                                v < p - 1 && this.readCurve(e, f, v),
                                v++
                        }
                        a.push(f),
                            (o = Math.max(
                                o,
                                f.frames[
                                    (f.getFrameCount() - 1) *
                                        ColorTimeline.ENTRIES
                                ]
                            ))
                    } else {
                        if (d != TimelineType.deform)
                            throw new Error(
                                'Invalid timeline type for a slot: ' +
                                    d +
                                    ' (' +
                                    l +
                                    ')'
                            )
                        let f = new TwoColorTimeline(p)
                        f.slotIndex = l
                        for (let v = 0, x = 0; x < p; x++) {
                            let m = e.readFloat(),
                                w = e.readColor(),
                                A = e.readColor()
                            w || (w = [1, 1, 1, 1]),
                                A || (A = [1, 1, 1, 1]),
                                f.setFrame(
                                    v,
                                    m,
                                    w[0],
                                    w[1],
                                    w[2],
                                    w[3],
                                    A[0],
                                    A[1],
                                    A[2]
                                ),
                                v < p - 1 && this.readCurve(e, f, v),
                                v++
                        }
                        a.push(f),
                            (o = Math.max(
                                o,
                                f.frames[
                                    (f.getFrameCount() - 1) *
                                        TwoColorTimeline.ENTRIES
                                ]
                            ))
                    }
                }
            for (let s = 0, T = e.readVarInt(); s < T; s++)
                for (
                    let E = e.readVarInt(), u = 0, c = e.readVarInt();
                    u < c;
                    u++
                ) {
                    let d = e.readByte(),
                        p = e.readVarInt()
                    if (d === TimelineType.rotate) {
                        let f = new RotateTimeline(p)
                        f.boneIndex = E
                        for (let v = 0, b = 0; b < p; b++)
                            f.setFrame(v, e.readFloat(), e.readFloat()),
                                v < p - 1 && this.readCurve(e, f, v),
                                v++
                        a.push(f),
                            (o = Math.max(
                                o,
                                f.frames[
                                    (f.getFrameCount() - 1) *
                                        RotateTimeline.ENTRIES
                                ]
                            ))
                    } else {
                        if (
                            d !== TimelineType.translate &&
                            d !== TimelineType.scale &&
                            d !== TimelineType.shear
                        )
                            throw new Error(
                                'Invalid timeline type for a bone: ' +
                                    d +
                                    ' (' +
                                    E +
                                    ')'
                            )
                        let f = null,
                            C = 1
                        d === TimelineType.scale
                            ? (f = new ScaleTimeline(p))
                            : d === TimelineType.shear
                            ? (f = new ShearTimeline(p))
                            : ((f = new TranslateTimeline(p)), (C = i)),
                            (f.boneIndex = E)
                        for (let v = 0, R = 0; R < p; R++) {
                            let m = e.readFloat(),
                                I = e.readFloat(),
                                S = e.readFloat()
                            f.setFrame(v, m, I * C, S * C),
                                v < p - 1 && this.readCurve(e, f, v),
                                v++
                        }
                        a.push(f),
                            (o = Math.max(
                                o,
                                f.frames[
                                    (f.getFrameCount() - 1) *
                                        TranslateTimeline.ENTRIES
                                ]
                            ))
                    }
                }
            for (let s = 0, P = e.readVarInt(); s < P; s++) {
                let V = e.readVarInt(),
                    p = e.readVarInt(),
                    f = new IkConstraintTimeline(p)
                f.ikConstraintIndex = V
                for (let v = 0, F = 0; F < p; F++)
                    f.setFrame(v, e.readFloat(), e.readFloat(), e.readSByte()),
                        v < p - 1 && this.readCurve(e, f, v),
                        v++
                a.push(f),
                    (o = Math.max(
                        o,
                        f.frames[
                            (f.getFrameCount() - 1) *
                                IkConstraintTimeline.ENTRIES
                        ]
                    ))
            }
            for (let s = 0, P = e.readVarInt(); s < P; s++) {
                let L = e.readVarInt(),
                    p = e.readVarInt(),
                    f = new TransformConstraintTimeline(p)
                f.transformConstraintIndex = L
                for (let v = 0, _ = 0; _ < p; _++)
                    f.setFrame(
                        v,
                        e.readFloat(),
                        e.readFloat(),
                        e.readFloat(),
                        e.readFloat(),
                        e.readFloat()
                    ),
                        v < p - 1 && this.readCurve(e, f, v),
                        v++
                a.push(f),
                    (o = Math.max(
                        o,
                        f.frames[
                            (f.getFrameCount() - 1) *
                                TransformConstraintTimeline.ENTRIES
                        ]
                    ))
            }
            for (let s = 0, P = e.readVarInt(); s < P; s++)
                for (
                    let k = e.readVarInt(),
                        N = n.pathConstraints[k],
                        u = 0,
                        D = e.readVarInt();
                    u < D;
                    u++
                ) {
                    let d = e.readByte() + 11,
                        p = e.readVarInt()
                    if (
                        d === TimelineType.pathConstraintPosition ||
                        d === TimelineType.pathConstraintSpacing
                    ) {
                        let f = null,
                            C = 1
                        d === TimelineType.pathConstraintSpacing
                            ? ((f = new PathConstraintSpacingTimeline(p)),
                              (N.spacingMode != SpacingMode.Length &&
                                  N.spacingMode != SpacingMode.Fixed) ||
                                  (C = i))
                            : ((f = new PathConstraintPositionTimeline(p)),
                              N.positionMode == PositionMode.Fixed && (C = i)),
                            (f.pathConstraintIndex = k)
                        for (let v = 0, B = 0; B < p; B++)
                            f.setFrame(v, e.readFloat(), e.readFloat() * C),
                                v < p - 1 && this.readCurve(e, f, v),
                                v++
                        a.push(f),
                            (o = Math.max(
                                o,
                                f.frames[
                                    (f.getFrameCount() - 1) *
                                        PathConstraintPositionTimeline.ENTRIES
                                ]
                            ))
                    } else if (d === TimelineType.pathConstraintMix) {
                        let f = new PathConstraintMixTimeline(p)
                        f.pathConstraintIndex = k
                        for (let v = 0, U = 0; U < p; U++)
                            f.setFrame(
                                v,
                                e.readFloat(),
                                e.readFloat(),
                                e.readFloat()
                            ),
                                v < p - 1 && this.readCurve(e, f, v),
                                v++
                        a.push(f),
                            (o = Math.max(
                                o,
                                f.frames[
                                    (f.getFrameCount() - 1) *
                                        PathConstraintMixTimeline.ENTRIES
                                ]
                            ))
                    }
                }
            for (let s = 0, P = e.readVarInt(); s < P; s++) {
                let O = e.readVarInt(),
                    X = n.skins[O]
                if (null == X) throw new Error('Skin not found: ' + O)
                for (let u = 0, D = e.readVarInt(); u < D; u++)
                    for (
                        let l = e.readVarInt(), Y = 0, W = e.readVarInt();
                        Y < W;
                        Y++
                    ) {
                        let G = e.readString(),
                            q = X.getAttachment(l, G) as VertexAttachment
                        if (null == q)
                            throw new Error('Deform attachment not found: ' + G)
                        let z = null != q.bones,
                            j = q.vertices,
                            H = z ? (j.length / 3) * 2 : j.length,
                            p = e.readVarInt(),
                            f = new DeformTimeline(p)
                        ;(f.slotIndex = l), (f.attachment = q)
                        for (let v = 0, Q = 0; Q < p; Q++) {
                            let m = e.readFloat(),
                                Z = e.readVarInt(),
                                K: ArrayLike<number> = void 0
                            if (0 == Z) K = z ? Utils.newFloatArray(H) : j
                            else {
                                K = Utils.newFloatArray(H)
                                let J = e.readVarInt()
                                if (((Z += J), 1 == i))
                                    for (let $ = J; $ < Z; $++)
                                        K[$] = e.readFloat()
                                else
                                    for (let $ = J; $ < Z; $++)
                                        K[$] = e.readFloat() * i
                                if (!z)
                                    for (let $ = 0, tt = K.length; $ < tt; $++)
                                        K[$] += j[$]
                            }
                            f.setFrame(v, m, K),
                                v < p - 1 && this.readCurve(e, f, v),
                                v++
                        }
                        a.push(f),
                            (o = Math.max(o, f.frames[f.getFrameCount() - 1]))
                    }
            }
            let et = e.readVarInt()
            if (et > 0) {
                let f = new DrawOrderTimeline(et)
                let h = n.slots.length
                for (let s = 0; s < et; s++) {
                    let m = e.readFloat()
                    let rt = e.readVarInt()
                    let nt = Utils.newArray(h, -1)
                    let it = new Array(h - rt)
                    let at = 0
                    let ot = 0
                    let u = 0
                    for (; u < rt; u++) {
                        for (let l = e.readVarInt(); at != l; ) it[ot++] = at++
                        nt[at + e.readVarInt()] = at++
                    }
                    for (; at < h; ) it[ot++] = at++
                    for (let u = h - 1; u >= 0; u--)
                        nt[u] == -1 && (nt[u] = it[--ot])
                    f.setFrame(s, m, nt)
                }
                a.push(f), (o = Math.max(o, f.frames[f.getFrameCount() - 1]))
            }
            let st = e.readVarInt()
            if (st > 0) {
                let f = new EventTimeline(st)
                for (let s = 0; s < st; s++) {
                    let m = e.readFloat(),
                        ht = e.readVarInt(),
                        lt = n.events[ht]
                    if (null == lt) throw new Error('Event not found: ' + ht)
                    let ut = new Event(Utils.toSinglePrecision(m), lt)
                    ;(ut.intValue = e.readVarInt(!1)),
                        (ut.floatValue = e.readFloat()),
                        (ut.stringValue = e.readBool()
                            ? e.readString()
                            : lt.stringValue),
                        f.setFrame(s, ut)
                }
                a.push(f), (o = Math.max(o, f.frames[f.getFrameCount() - 1]))
            }
            if (isNaN(o))
                throw new Error(
                    'Error while parsing animation, duration is NaN'
                )
            n.animations.push(new Animation(r, a, o))
        }
        readCurve(e: BinaryInput, r: CurveTimeline, n: number) {
            let i = e.readByte()
            i === CurveTimeline.STEPPED
                ? r.setStepped(n)
                : i === CurveTimeline.BEZIER &&
                  r.setCurve(
                      n,
                      e.readFloat(),
                      e.readFloat(),
                      e.readFloat(),
                      e.readFloat()
                  )
        }
    }
    class LinkedMesh {
        parent: string
        skin: string
        slotIndex: number
        mesh: MeshAttachment

        constructor(
            mesh: MeshAttachment,
            skin: string,
            slotIndex: number,
            parent: string
        ) {
            this.mesh = mesh
            this.skin = skin
            this.slotIndex = slotIndex
            this.parent = parent
        }
    }
    class BinaryInput {
        offset: number
        size: number
        buffer: Uint8Array
        floatBuf: ArrayBuffer
        floatBufIn: Uint8Array
        floatBufOut: Uint32Array
        doubleBuf: ArrayBuffer
        doubleBufIn: Uint8Array
        doubleBufOut: Float64Array
        constructor(t: Uint8Array) {
            this.offset = 0
            this.size = t.byteLength
            this.buffer = new Uint8Array(t)
            this.floatBuf = new ArrayBuffer(4)
            this.floatBufIn = new Uint8Array(this.floatBuf)
            this.floatBufOut = new Uint32Array(this.floatBuf)
            this.doubleBuf = new ArrayBuffer(8)
            this.doubleBufIn = new Uint8Array(this.doubleBuf)
            this.doubleBufOut = new Float64Array(this.doubleBuf)
        }
        readByte() {
            return this.buffer[this.offset++]
        }
        readSByte() {
            let t = this.readByte()
            t > 127 && (t -= 256)
            return t
        }
        readBool() {
            return 0 != this.readByte()
        }
        readShort() {
            let t = this.readByte()
            return (t <<= 8), (t |= this.readByte())
        }
        readInt() {
            let t = this.readByte()
            return (
                (t <<= 8),
                (t |= this.readByte()),
                (t <<= 8),
                (t |= this.readByte()),
                (t <<= 8),
                (t |= this.readByte())
            )
        }
        readVarInt(t?: boolean) {
            void 0 === t && (t = !0)
            let e = this.readByte(),
                r = 127 & e
            return (
                128 & e &&
                    ((e = this.readByte()),
                    (r |= (127 & e) << 7),
                    128 & e &&
                        ((e = this.readByte()),
                        (r |= (127 & e) << 14),
                        128 & e &&
                            ((e = this.readByte()),
                            (r |= (127 & e) << 21),
                            128 & e &&
                                ((e = this.readByte()),
                                (r |= (127 & e) << 28))))),
                t || (r = (r >>> 1) ^ -(1 & r)),
                r
            )
        }
        readFloat() {
            return (
                (this.floatBufIn[3] = this.readByte()),
                (this.floatBufIn[2] = this.readByte()),
                (this.floatBufIn[1] = this.readByte()),
                (this.floatBufIn[0] = this.readByte()),
                this.floatBufOut[0]
            )
        }
        readString() {
            let t = this.readVarInt()
            if (0 == t) return null
            let e = new Uint8Array(
                this.buffer.buffer.slice(this.offset, this.offset + t - 1)
            )
            return (
                (this.offset += t - 1),
                decodeURIComponent(escape(String.fromCharCode.apply(null, e)))
            )
        }
        readColor() {
            let t = [
                this.readByte() / 255,
                this.readByte() / 255,
                this.readByte() / 255,
                this.readByte() / 255,
            ]
            return (
                1 == t[0] && 1 == t[1] && 1 == t[2] && 1 == t[3] && (t = null),
                t
            )
        }
    }
}
