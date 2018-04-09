entry %
align %
addi  r1, r0, topaddr  %
addi  r2, r0, topaddr  %
addi r14, r0, topaddr
addi r3, r0, 1260 %
sw -4(r2), r3 %
lw r10, -4(r2)
sw -8(r14), r10 %
addi   r1,r10,buf
sw     -12(r14),r1
jl r15, intstr %
sw     -8(r14),r13
jl     r15,putstr
hlt %
buf   res    20
