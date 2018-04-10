entry % Program start
		 addi	 r1, r0, topaddr  % Set frame pointer
		 addi	 r2, r0, topaddr  % Set stack pointer
		 addi	 r14, r0, topaddr  % Set func stack pointer
		 addi	 r9, r0, 5
		 sw	 -8(r2),  r9
		 addi	 r9, r0, 2
		 sw	 -12(r2),  r9
		 lw	 r6, -8(r2)
		 lw	 r7, -12(r2)
		 mul	 r8,r6,r7
		 sw	 -16(r2), r8
		 addi	 r9, r0, 3
		 sw	 -20(r2),  r9
		 addi	 r9, r0, 6
		 sw	 -24(r2),  r9
		 lw	 r6, -20(r2)
		 lw	 r7, -24(r2)
		 mul	 r8,r6,r7
		 sw	 -28(r2), r8
		 lw	 r3, -16(r2)
		 lw	 r4, -28(r2)
		 add	 r5,r3,r4
		 sw	 -32(r2), r5
		 lw	 r3, -32(r2)
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
