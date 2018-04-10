entry % Program start
		 addi	 r1, r0, topaddr  % Set frame pointer
		 addi	 r2, r0, topaddr  % Set stack pointer
		 addi	 r14, r0, topaddr  % Set func stack pointer
		 addi	 r3, r0, 1
		 sw	 -16(r2),  r3
		 addi	 r3, r0, 5
		 sw	 -20(r2),  r3
		 addi	 r3, r0, 2
		 sw	 -24(r2),  r3
		 lw	 r3, -20(r2)
		 lw	 r4, -24(r2)
		 mul	 r5,r3,r4
		 sw	 -28(r2), r5
		 addi	 r3, r0, 3
		 sw	 -32(r2),  r3
		 addi	 r3, r0, 6
		 sw	 -36(r2),  r3
		 lw	 r3, -32(r2)
		 lw	 r4, -36(r2)
		 mul	 r5,r3,r4
		 sw	 -40(r2), r5
		 lw	 r3, -28(r2)
		 lw	 r4, -40(r2)
		 add	 r5,r3,r4
		 sw	 -44(r2), r5
		 addi	 r3, r0, 10
		 sw	 -48(r2),  r3
		 addi	 r3, r0, 5
		 sw	 -52(r2),  r3
		 lw	 r3, -48(r2)
		 lw	 r4, -52(r2)
		 div	 r5,r3,r4
		 sw	 -56(r2), r5
		 lw	 r3, -44(r2)
		 lw	 r4, -56(r2)
		 sub	 r5,r3,r4
		 sw	 -60(r2), r5
		 addi	 r3, r0, 10
		 sw	 -64(r2),  r3
		 lw	 r3, -60(r2)
		 lw	 r4, -64(r2)
		 mul	 r5,r3,r4
		 sw	 -68(r2), r5
		 lw	 r3, -16(r2)
		 lw	 r4, -68(r2)
		 add	 r5,r3,r4
		 sw	 -72(r2), r5
		 addi	 r3, r0, 10
		 sw	 -76(r2),  r3
		 lw	 r3, -72(r2)
		 lw	 r4, -76(r2)
		 mul	 r5,r3,r4
		 sw	 -80(r2), r5
		 lw	 r3, -80(r2)
		 sw	 -4(r2),  r3
		 addi	 r3, r0, 50
		 sw	 -84(r2),  r3
		 lw	 r3, -84(r2)
		 lw	 r4, -4(r2)
		 add	 r5,r3,r4
		 sw	 -88(r2), r5
		 addi	 r3, r0, 2
		 sw	 -92(r2),  r3
		 addi	 r3, r0, 100
		 sw	 -96(r2),  r3
		 addi	 r3, r0, 2
		 sw	 -100(r2),  r3
		 lw	 r3, -96(r2)
		 lw	 r4, -100(r2)
		 div	 r5,r3,r4
		 sw	 -104(r2), r5
		 lw	 r3, -92(r2)
		 lw	 r4, -104(r2)
		 mul	 r5,r3,r4
		 sw	 -108(r2), r5
		 lw	 r3, -88(r2)
		 lw	 r4, -108(r2)
		 sub	 r5,r3,r4
		 sw	 -112(r2), r5
		 addi	 r3, r0, 7
		 sw	 -116(r2),  r3
		 addi	 r3, r0, 5
		 sw	 -120(r2),  r3
		 lw	 r3, -116(r2)
		 lw	 r4, -120(r2)
		 mul	 r5,r3,r4
		 sw	 -124(r2), r5
		 lw	 r3, -112(r2)
		 lw	 r4, -124(r2)
		 add	 r5,r3,r4
		 sw	 -128(r2), r5
		 addi	 r3, r0, 3
		 sw	 -132(r2),  r3
		 lw	 r3, -128(r2)
		 lw	 r4, -132(r2)
		 add	 r5,r3,r4
		 sw	 -136(r2), r5
		 addi	 r3, r0, 5
		 sw	 -140(r2),  r3
		 lw	 r3, -136(r2)
		 lw	 r4, -140(r2)
		 add	 r5,r3,r4
		 sw	 -144(r2), r5
		 addi	 r3, r0, 1
		 sw	 -148(r2),  r3
		 lw	 r3, -144(r2)
		 lw	 r4, -148(r2)
		 sub	 r5,r3,r4
		 sw	 -152(r2), r5
		 lw	 r3, -152(r2)
		 lw	 r4, -4(r2)
		 add	 r5,r3,r4
		 sw	 -156(r2), r5
		 lw	 r3, -156(r2)
		 sw	 -8(r2),  r3
		 addi	 r3, r0, 10
		 sw	 -160(r2),  r3
		 lw	 r3, -160(r2)
		 lw	 r4, -8(r2)
		 mul	 r5,r3,r4
		 sw	 -164(r2), r5
		 lw	 r3, -164(r2)
		 lw	 r4, -4(r2)
		 mul	 r5,r3,r4
		 sw	 -168(r2), r5
		 addi	 r3, r0, 50
		 sw	 -172(r2),  r3
		 lw	 r3, -168(r2)
		 lw	 r4, -172(r2)
		 sub	 r5,r3,r4
		 sw	 -176(r2), r5
		 lw	 r3, -176(r2)
		 sw	 -12(r2),  r3
		 lw	 r3, -12(r2)
		 sw	 -8(r14), r3
		 addi	 r4,r0,buf
		 sw	 -12(r14), r4
		 jl	 r15, intstr
		 sw	 -8(r14), r13
		 jl	 r15, putstr
		 addi	 r2, r0, topaddr  % Set stack pointer
		 hlt
buf	res	20
