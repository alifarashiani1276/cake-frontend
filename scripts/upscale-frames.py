import cv2, os, numpy as np
sr=cv2.dnn_superres.DnnSuperResImpl_create(); sr.readModel('probe/ESPCN_x2.pb'); sr.setModel('espcn',2)
root='cake-scroll/public'
for d in ('frames-hd','frames-mid'): os.makedirs(f'{root}/{d}',exist_ok=True)
for i in range(1,241):
    im=cv2.imread(f'probe/ref/{i:03d}.png')
    up=sr.upsample(im)  # 2560x1440
    for d,size in (('frames-hd',(1920,1080)),('frames-mid',(1600,900))):
        o=cv2.resize(up,size,interpolation=cv2.INTER_AREA)
        blur=cv2.GaussianBlur(o,(0,0),1.0)
        o=cv2.addWeighted(o,1.35,blur,-0.35,0)   # light unsharp
        cv2.imwrite(f'{root}/{d}/{i:03d}.webp',o,[cv2.IMWRITE_WEBP_QUALITY,92])
    if i%20==0: open('/tmp/up.log','w').write(str(i))
open('/tmp/up.log','w').write('done')
