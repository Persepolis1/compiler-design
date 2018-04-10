entry % Program start
		 addi	 r1, r0, topaddr  % Set frame pointer
		 addi	 r2, r0, topaddr  % Set stack pointer
		 addi	 r14, r0, topaddr  % Set func stack pointer
		 addi	 r3, r0, 1
		 sw	 -8(r2),  r3
		 addi	 r3, r0, 5
		 sw	 -12(r2),  r3
		 addi	 r3, r0, 2
		 sw	 -16(r2),  r3
		 lw	 r3, -12(r2)
		 lw	 r4, -16(r2)
		 mul	 r5,r3,r4
		 sw	 -20(r2), r5
		 addi	 r3, r0, 3
		 sw	 -24(r2),  r3
		 addi	 r3, r0, 6
		 sw	 -28(r2),  r3
		 lw	 r3, -24(r2)
		 lw	 r4, -28(r2)
		 mul	 r5,r3,r4
		 sw	 -32(r2), r5
		 lw	 r3, -20(r2)
		 lw	 r4, -32(r2)
		 add	 r5,r3,r4
		 sw	 -36(r2), r5
		 addi	 r3, r0, 10
		 sw	 -40(r2),  r3
		 addi	 r3, r0, 5
		 sw	 -44(r2),  r3
		 lw	 r3, -40(r2)
		 lw	 r4, -44(r2)
		 div	 r5,r3,r4
		 sw	 -48(r2), r5
		 lw	 r3, -36(r2)
		 lw	 r4, -48(r2)
		 sub	 r5,r3,r4
		 sw	 -52(r2), r5
		 addi	 r3, r0, 10
		 sw	 -56(r2),  r3
		 lw	 r3, -52(r2)
		 lw	 r4, -56(r2)
		 mul	 r5,r3,r4
		 sw	 -60(r2), r5
		 lw	 r3, -8(r2)
		 lw	 r4, -60(r2)
		 add	 r5,r3,r4
		 sw	 -64(r2), r5
		 addi	 r3, r0, 10
		 sw	 -68(r2),  r3
		 lw	 r3, -64(r2)
		 lw	 r4, -68(r2)
		 mul	 r5,r3,r4
		 sw	 -72(r2), r5
		 lw	 r3, -72(r2)
		 sw	 -4(r2),  r3
		 lw	 r3, -4(r2)
		 sw	 -8(r14), r3
		 addi	 r4,r0,buf
		 sw	 -12(r14), r4
		 jl	 r15, intstr
		 sw	 -8(r14), r13
		 jl	 r15, putstr
		 addi	 r2, r0, topaddr  % Set stack pointer
		 hlt
buf	res	20
