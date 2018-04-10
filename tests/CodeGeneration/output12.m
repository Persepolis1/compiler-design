addNumbers		 addi	 r2, r0, topaddr
		 lw	 r3, -4(r14)
		 sw	  -4(r2), r3
		 lw	 r3, -8(r14)
		 sw	  -8(r2), r3
		 lw	 r3, -12(r14)
		 sw	  -12(r2), r3
		 lw	 r3, -16(r14)
		 sw	  -16(r2), r3
		 lw	 r3, -20(r14)
		 sw	  -20(r2), r3
		 lw	 r3, -24(r14)
		 sw	  -24(r2), r3
		 lw	 r3, -28(r14)
		 sw	  -28(r2), r3
		 lw	 r3, -32(r14)
		 sw	  -32(r2), r3
		 lw	 r3, -36(r14)
		 sw	  -36(r2), r3
		 lw	 r3, -40(r14)
		 sw	  -40(r2), r3
		 lw	 r3, -44(r14)
		 sw	  -44(r2), r3
		 lw	 r3, -48(r14)
		 sw	  -48(r2), r3
		 lw	 r3, -52(r14)
		 sw	  -52(r2), r3
		 lw	 r3, -56(r14)
		 sw	  -56(r2), r3
		 lw	 r3, -60(r14)
		 sw	  -60(r2), r3
		 lw	 r3, -64(r14)
		 sw	  -64(r2), r3
		 lw	 r3, -68(r14)
		 sw	  -68(r2), r3
		 lw	 r3, -72(r14)
		 sw	  -72(r2), r3
		 lw	 r3, -76(r14)
		 sw	  -76(r2), r3
		 lw	 r3, -4(r2)
		 lw	 r4, -8(r2)
		 add	 r5,r3,r4
		 sw	 -84(r2), r5
		 lw	 r3, -84(r2)
		 lw	 r4, -12(r2)
		 add	 r5,r3,r4
		 sw	 -88(r2), r5
		 lw	 r3, -88(r2)
		 lw	 r4, -16(r2)
		 add	 r5,r3,r4
		 sw	 -92(r2), r5
		 lw	 r3, -92(r2)
		 lw	 r4, -20(r2)
		 add	 r5,r3,r4
		 sw	 -96(r2), r5
		 lw	 r3, -96(r2)
		 lw	 r4, -24(r2)
		 add	 r5,r3,r4
		 sw	 -100(r2), r5
		 lw	 r3, -100(r2)
		 lw	 r4, -28(r2)
		 add	 r5,r3,r4
		 sw	 -104(r2), r5
		 lw	 r3, -104(r2)
		 lw	 r4, -32(r2)
		 add	 r5,r3,r4
		 sw	 -108(r2), r5
		 lw	 r3, -108(r2)
		 lw	 r4, -36(r2)
		 add	 r5,r3,r4
		 sw	 -112(r2), r5
		 lw	 r3, -112(r2)
		 lw	 r4, -40(r2)
		 add	 r5,r3,r4
		 sw	 -116(r2), r5
		 lw	 r3, -116(r2)
		 lw	 r4, -44(r2)
		 add	 r5,r3,r4
		 sw	 -120(r2), r5
		 lw	 r3, -120(r2)
		 lw	 r4, -48(r2)
		 add	 r5,r3,r4
		 sw	 -124(r2), r5
		 lw	 r3, -124(r2)
		 lw	 r4, -52(r2)
		 add	 r5,r3,r4
		 sw	 -128(r2), r5
		 lw	 r3, -128(r2)
		 lw	 r4, -56(r2)
		 add	 r5,r3,r4
		 sw	 -132(r2), r5
		 lw	 r3, -132(r2)
		 lw	 r4, -60(r2)
		 add	 r5,r3,r4
		 sw	 -136(r2), r5
		 lw	 r3, -136(r2)
		 lw	 r4, -64(r2)
		 add	 r5,r3,r4
		 sw	 -140(r2), r5
		 lw	 r3, -140(r2)
		 lw	 r4, -68(r2)
		 add	 r5,r3,r4
		 sw	 -144(r2), r5
		 lw	 r3, -144(r2)
		 lw	 r4, -72(r2)
		 add	 r5,r3,r4
		 sw	 -148(r2), r5
		 lw	 r3, -148(r2)
		 lw	 r4, -76(r2)
		 add	 r5,r3,r4
		 sw	 -152(r2), r5
		 lw	 r3, -152(r2)
		 sw	 -80(r2),  r3
		 lw	 r13, -80(r2)
		 jr r15
subNumbers		 addi	 r2, r0, topaddr
		 lw	 r3, -4(r14)
		 sw	  -4(r2), r3
		 lw	 r3, -8(r14)
		 sw	  -8(r2), r3
		 lw	 r3, -4(r2)
		 lw	 r4, -8(r2)
		 sub	 r5,r3,r4
		 sw	 -12(r2), r5
		 lw	 r13, -12(r2)
		 jr r15
entry % Program start
		 addi	 r1, r0, topaddr  % Set frame pointer
		 addi	 r2, r0, topaddr  % Set stack pointer
		 addi	 r14, r0, topaddr  % Set func stack pointer
		 addi	 r3, r0, 1
		 sw	 -12(r2),  r3
		 lw	 r3, -12(r2)
		 sw	 -4(r14), r3
		 addi	 r3, r0, 1
		 sw	 -16(r2),  r3
		 lw	 r3, -16(r2)
		 sw	 -8(r14), r3
		 addi	 r3, r0, 1
		 sw	 -20(r2),  r3
		 lw	 r3, -20(r2)
		 sw	 -12(r14), r3
		 addi	 r3, r0, 1
		 sw	 -24(r2),  r3
		 lw	 r3, -24(r2)
		 sw	 -16(r14), r3
		 addi	 r3, r0, 1
		 sw	 -28(r2),  r3
		 lw	 r3, -28(r2)
		 sw	 -20(r14), r3
		 addi	 r3, r0, 1
		 sw	 -32(r2),  r3
		 lw	 r3, -32(r2)
		 sw	 -24(r14), r3
		 addi	 r3, r0, 1
		 sw	 -36(r2),  r3
		 lw	 r3, -36(r2)
		 sw	 -28(r14), r3
		 addi	 r3, r0, 1
		 sw	 -40(r2),  r3
		 lw	 r3, -40(r2)
		 sw	 -32(r14), r3
		 addi	 r3, r0, 1
		 sw	 -44(r2),  r3
		 lw	 r3, -44(r2)
		 sw	 -36(r14), r3
		 addi	 r3, r0, 1
		 sw	 -48(r2),  r3
		 lw	 r3, -48(r2)
		 sw	 -40(r14), r3
		 addi	 r3, r0, 1
		 sw	 -52(r2),  r3
		 lw	 r3, -52(r2)
		 sw	 -44(r14), r3
		 addi	 r3, r0, 1
		 sw	 -56(r2),  r3
		 lw	 r3, -56(r2)
		 sw	 -48(r14), r3
		 addi	 r3, r0, 1
		 sw	 -60(r2),  r3
		 lw	 r3, -60(r2)
		 sw	 -52(r14), r3
		 addi	 r3, r0, 1
		 sw	 -64(r2),  r3
		 lw	 r3, -64(r2)
		 sw	 -56(r14), r3
		 addi	 r3, r0, 1
		 sw	 -68(r2),  r3
		 lw	 r3, -68(r2)
		 sw	 -60(r14), r3
		 addi	 r3, r0, 1
		 sw	 -72(r2),  r3
		 lw	 r3, -72(r2)
		 sw	 -64(r14), r3
		 addi	 r3, r0, 1
		 sw	 -76(r2),  r3
		 lw	 r3, -76(r2)
		 sw	 -68(r14), r3
		 addi	 r3, r0, 1
		 sw	 -80(r2),  r3
		 lw	 r3, -80(r2)
		 sw	 -72(r14), r3
		 addi	 r3, r0, 1
		 sw	 -84(r2),  r3
		 lw	 r3, -84(r2)
		 sw	 -76(r14), r3
		 jl	 r15, addNumbers
		 sw	 -88(r2), r13
		 addi	 r3, r0, 2
		 sw	 -92(r2),  r3
		 lw	 r3, -88(r2)
		 lw	 r4, -92(r2)
		 mul	 r5,r3,r4
		 sw	 -96(r2), r5
		 lw	 r3, -96(r2)
		 sw	 -4(r2),  r3
		 lw	 r3, -4(r2)
		 sw	 -8(r14), r3
		 addi	 r4,r0,buf
		 sw	 -12(r14), r4
		 jl	 r15, intstr
		 sw	 -8(r14), r13
		 jl	 r15, putstr
		 addi	 r2, r0, topaddr  % Set stack pointer
		 addi	 r3, r0, 10
		 sw	 -100(r2),  r3
		 lw	 r3, -100(r2)
		 sw	 -4(r14), r3
		 addi	 r3, r0, 5
		 sw	 -104(r2),  r3
		 lw	 r3, -104(r2)
		 sw	 -8(r14), r3
		 jl	 r15, subNumbers
		 sw	 -108(r2), r13
		 lw	 r3, -108(r2)
		 sw	 -8(r2),  r3
		 lw	 r3, -8(r2)
		 sw	 -8(r14), r3
		 addi	 r4,r0,buf
		 sw	 -12(r14), r4
		 jl	 r15, intstr
		 sw	 -8(r14), r13
		 jl	 r15, putstr
		 addi	 r2, r0, topaddr  % Set stack pointer
		 hlt
buf	res	20
