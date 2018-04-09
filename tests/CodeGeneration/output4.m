entry % Program start
		 addi	 r1, r0, topaddr  % Set frame pointer
		 addi	 r2, r0, topaddr  % Set stack pointer
		 addi	 r14, r0, topaddr  % Set func stack pointer
		 addi	 r6, r0, 5
		 sw	 -12(r2),  r6
		 addi	 r6, r0, 5
		 sw	 -16(r2),  r6
		 lw	 r3, -12(r2)
		 lw	 r4, -16(r2)
		 add	 r5,r4,r3
		 sw	 -20(r2), r5
		 lw	 r3, -20(r2)
		 sw	 -4(r2),  r3
		 lw	 r3, -4(r2)
		 sw	 -8(r14), r3
		 addi	 r4,r0,buf
		 sw	 -12(r14), r4
		 jl	 r15, intstr
		 sw	 -8(r14), r13
		 jl	 r15, putstr
		 addi	 r2, r0, topaddr  % Set stack pointer
		 addi	 r6, r0, 15
		 sw	 -24(r2),  r6
		 addi	 r6, r0, 17
		 sw	 -28(r2),  r6
		 lw	 r3, -24(r2)
		 lw	 r4, -28(r2)
		 add	 r5,r4,r3
		 sw	 -32(r2), r5
		 lw	 r3, -32(r2)
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
